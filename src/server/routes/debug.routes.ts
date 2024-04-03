import express from "express";

import { ServicesResolved } from "../../providers";
import { routerWrapper } from "./router-wrapper";

export function createRoutesDebug(services: ServicesResolved) {
  const router = express.Router();

  router.post(
    "/base",
    routerWrapper(async () => {
      const { actorService, filmService } = services;

      const kirillId = await actorService.insert({
        name: "Kirill",
      });

      const artemId = await actorService.insert({
        name: "Artem",
      });

      const nikoId = await actorService.insert({
        name: "Nik",
      });

      const jonId_ = await actorService.insert({
        name: "Jon",
      });

      await actorService.remove(jonId_);

      await actorService.patch({
        actorId: nikoId,
        name: "Niko",
      });

      const jemmyId = await actorService.insert({
        name: "Jemmy",
      });

      const stasId = await actorService.insert({
        name: "Stas",
      });

      const Actors = {
        Kirill: kirillId,
        Artem: artemId,
        Niko: nikoId,
        Jemmy: jemmyId,
        Stas: stasId,
      };

      const duneId = await filmService.insert({
        name: "Dune",
        actors: [Actors.Kirill, Actors.Artem],
      });

      const terminatorId = await filmService.insert({
        name: "Terminator",
        actors: [Actors.Niko, Actors.Stas],
      });

      const terminator2Id = await filmService.insert({
        name: "Terminator 2",
        actors: [Actors.Niko, Actors.Jemmy],
      });

      const terminator3Id = await filmService.insert({
        name: "Terminator 3",
        actors: [Actors.Niko, Actors.Jemmy],
      });

      const prestigeId = await filmService.insert({
        name: "Prestige",
        actors: [Actors.Kirill, Actors.Jemmy],
      });

      const wolfId = await filmService.insert({
        name: "Wolf of Wall Street",
        actors: [Actors.Jemmy],
      });

      await filmService.patch({
        filmId: wolfId,
        name: "Wolf",
      });

      await filmService.patch({
        filmId: terminator2Id,
        actors: [Actors.Niko, Actors.Stas],
      });

      await filmService.remove(terminator3Id);

      await actorService.remove(Actors.Jemmy);

      await filmService.patch({
        filmId: wolfId,
        actors: [Actors.Niko],
      });

      const Films = {
        Dune: duneId,
        Terminator: terminatorId,
        Terminator2: terminator2Id,
        Prestige: prestigeId,
        Wolf: wolfId,
      };

      const actors = await actorService.findAll();
      const films = await filmService.findAll();

      const result = {
        actors,
        films,
        Actors,
        Films,
      };

      return [200, result];
    })
  );

  return router;
}
