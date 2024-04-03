import { injector } from "../../di-mechanism";

import { DatabaseProvider } from "../../database/provider";

import { ActorDbEntity } from "../../../types/db-entities";

export const ActorServiceProvider = injector(
  { database: DatabaseProvider },
  async ({ database }) => {
    const findAll = async () => {
      const actors: ActorDbEntity[] = await database.all(`
        SELECT * from actor
      `);

      return actors;
    };

    const findById = async (actorId: number) => {
      const actors: ActorDbEntity[] = await database.all(`
        SELECT * from actor
        WHERE id = ${actorId}
      `);

      if (actors.length == 0) {
        throw new Error(`Actor with id ${actorId} not found`);
      }

      return actors[0];
    };

    const insert = async (payload: { name: string }) => {
      const sql = `
        INSERT INTO actor (name) VALUES (?);
        SELECT last_insert_rowid() as id;
      `;

      const inserted = await database.run({
        sql,
        values: [payload.name],
      });

      return inserted.lastID!;
    };

    const patch = async (payload: { actorId: number; name?: string }) => {
      if (typeof payload.name != "string") {
        return;
      }

      const sql = `
        UPDATE actor SET name = ? WHERE id = ${payload.actorId}
      `;

      await database.run({
        sql,
        values: [payload.name],
      });
    };

    const remove = async (actorId: number) => {
      const sql = `
        DELETE FROM actor WHERE id = ${actorId};
        DELETE FROM rel_actor_film WHERE actor_id = ${actorId};
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
