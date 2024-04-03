import express from "express";

import { ServicesResolved } from "../../providers";

import { routerWrapper } from "./router-wrapper";

export function createRoutesFilm(services: ServicesResolved) {
  const router = express.Router();

  router.get(
    "/films",
    routerWrapper(async () => {
      const films = await services.filmService.findAll();

      return [200, films];
    })
  );

  router.get(
    "/film/:filmId",
    routerWrapper(async (req) => {
      const filmId = +req.params.filmId;

      /// TODO: validate and prepared request payload

      const film = await services.filmService.findById(filmId);

      return [200, film];
    })
  );

  router.post(
    "/film",
    routerWrapper(async (req) => {
      const payload = req.body as { name: string; actors: number[] };

      /// TODO: validate and prepared request payload

      const filmId = await services.filmService.insert(payload);
      const film = await services.filmService.findById(filmId);

      return [201, film];
    })
  );

  router.patch(
    "/film/:filmId",
    routerWrapper(async (req) => {
      const filmId = +req.params.filmId;
      const payload = req.body as { name?: string; actors?: number[] };

      /// TODO: validate and prepared request payload

      await services.filmService.patch({
        filmId,
        ...payload,
      });

      const film = await services.filmService.findById(filmId);

      return [200, film];
    })
  );

  router.delete(
    "/film/:filmId",
    routerWrapper(async (req) => {
      const filmId = +req.params.filmId;

      /// TODO: validate and prepared request payload

      await services.filmService.remove(filmId);

      return [200, {}];
    })
  );

  return router;
}
