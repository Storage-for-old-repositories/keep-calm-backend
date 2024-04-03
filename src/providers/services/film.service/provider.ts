import { injector } from "../../di-mechanism";

import { DatabaseProvider } from "../../database/provider";

import {
  ActorDbEntity,
  FilmDbEntity,
  RelActorFilmDbEntity,
} from "../../../types/db-entities";

export const FilmServiceProvider = injector(
  { database: DatabaseProvider },
  async ({ database }) => {
    const findAll = async () => {
      /// TODO: может транзакция, или JOIN?
      const [films, actors, rels] = await Promise.all([
        database.all(`
          SELECT * from film
      `) as Promise<FilmDbEntity[]>,
        database.all(`
          SELECT * from actor
      `) as Promise<ActorDbEntity[]>,
        database.all(`
          SELECT * from rel_actor_film
      `) as Promise<RelActorFilmDbEntity[]>,
      ]);

      const filmsMap = new Map(
        films.map(({ id, name }) => [
          id,
          {
            id,
            name,
            actors: [] as { id: number; name: string }[],
          },
        ])
      );

      const actorsMap = new Map(
        actors.map(({ id, name }) => [
          id,
          {
            id,
            name,
          },
        ])
      );

      for (const { actor_id, film_id } of rels) {
        const film = filmsMap.get(film_id);
        const actor = actorsMap.get(actor_id);

        if (!film) {
          continue;
        }
        if (!actor) {
          continue;
        }

        film.actors.push(actor);
      }

      const result = [...filmsMap.values()];
      return result;
    };

    const findById = async (filmId: number) => {
      /// TODO: может транзакция, или JOIN?
      const [films, actors] = await Promise.all([
        database.all(
          `
          SELECT * from film
          WHERE id = ?
      `,
          filmId
        ) as Promise<FilmDbEntity[]>,
        database.all(
          `
          SELECT 
            actor.id, actor.name
          FROM actor
          JOIN rel_actor_film ON actor.id = rel_actor_film.actor_id
          WHERE rel_actor_film.film_id = ?
      `,
          filmId
        ) as Promise<ActorDbEntity[]>,
      ]);

      if (films.length === 0) {
        throw new Error(`Film with id ${filmId} not found`);
      }

      const film = films[0];

      const result = {
        actors,
        ...film,
      };

      return result;
    };

    const insert = async (payload: { name: string; actors: number[] }) => {
      try {
        await database.run("BEGIN");

        const stmt = await database.run(
          `INSERT INTO film (name) VALUES (?)`,
          payload.name
        );

        const filmId = stmt.lastID!;

        if (payload.actors.length === 0) {
          await database.run("COMMIT");
          return filmId;
        }

        for (const actorId of payload.actors) {
          await database.run(
            `
            INSERT INTO rel_actor_film (actor_id, film_id) VALUES (?, ?)
          `,
            actorId,
            filmId
          );
        }

        await database.run("COMMIT");
        return filmId;
      } catch (error) {
        await database.run("ROLLBACK");
        throw error;
      }
    };

    const patch = async (payload: {
      filmId: number;
      name?: string;
      actors?: number[];
    }) => {
      if (typeof payload.name != "string" && !Array.isArray(payload.actors)) {
        return;
      }

      /**
       * Код ниже не правильный, но я оставлю его, чтобы сравнивать его с кодом выше
       * Даже не смотря на то, что этот код не правильный, он работает правильно!
       */

      const sql = `
        BEGIN TRANSACTION;

        ${
          (payload.actors &&
            `
            DELETE FROM rel_actor_film WHERE film_id = ${payload.filmId};
            ${payload.actors
              .map((actorId) => {
                return `
                INSERT INTO rel_actor_film (actor_id, film_id) 
                VALUES (${actorId}, ${payload.filmId});
              `;
              })
              .join("\n")}
          `) ||
          " "
        }

        ${`
          UPDATE film 
            SET name = COALESCE(
              ${
                /* :( hi injection */
                typeof payload.name == "string" ? `'${payload.name}'` : "NULL"
              },
              (SELECT name FROM film WHERE id = ${payload.filmId})
            )
          WHERE id = ${payload.filmId};
          
          DELETE FROM rel_actor_film 
          WHERE film_id = ${payload.filmId} AND changes() = 0;
        `}

        COMMIT;
      `;

      await database.exec({
        sql,
        values: [],
      });
    };

    const remove = async (filmId: number) => {
      const sql = `
        DELETE FROM film WHERE id = ${filmId};
        DELETE FROM rel_actor_film WHERE film_id = ${filmId};
      `;

      await database.exec({
        sql,
        values: [],
      });
    };

    return {
      findAll,
      findById,
      insert,
      patch,
      remove,
    };
  }
);
