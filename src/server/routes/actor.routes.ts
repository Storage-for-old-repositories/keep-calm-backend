import express from "express";

import { ServicesResolved } from "../../providers";
import { routerWrapper } from "./router-wrapper";

export function createRoutesActor(services: ServicesResolved) {
  const router = express.Router();

  router.get(
    "/actors",
    routerWrapper(async () => {
      const actors = await services.actorService.findAll();

      return [200, actors];
    })
  );

  router.get(
    "/actor/:actorId",
    routerWrapper(async (req) => {
      const actorId = +req.params.actorId;

      /// TODO: validate and prepared request payload

      const actor = await services.actorService.findById(actorId);

      return [200, actor];
    })
  );

  router.post(
    "/actor",
    routerWrapper(async (req) => {
      const payload = req.body as { name: string };

      /// TODO: validate and prepared request payload

      const actorId = await services.actorService.insert(payload);
      const actor = await services.actorService.findById(actorId);

      return [201, actor];
    })
  );

  router.patch(
    "/actor/:actorId",
    routerWrapper(async (req) => {
      const actorId = +req.params.actorId;
      const payload = req.body as { name?: string };

      /// TODO: validate and prepared request payload

      await services.actorService.patch({
        actorId,
        ...payload,
      });

      const actor = await services.actorService.findById(actorId);

      return [200, actor];
    })
  );

  router.delete(
    "/actor/:actorId",
    routerWrapper(async (req) => {
      const actorId = +req.params.actorId;

      /// TODO: validate and prepared request payload

      await services.actorService.remove(actorId);

      return [200, {}];
    })
  );

  return router;
}
