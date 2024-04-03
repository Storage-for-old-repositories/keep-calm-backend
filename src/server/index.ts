import express from "express";

import { ServicesResolved } from "../providers";

import {
  createRoutesFilm,
  createRoutesActor,
  createRoutesDebug,
} from "./routes";

async function createServer() {
  const server = express();

  server.use(express.json());

  return [
    server,
    async () => {
      const port = 3013;
      server.listen(port);

      console.log(`server started on port ${port}`);
    },
  ] as const;
}

export async function startServer(services: ServicesResolved) {
  const [server, start] = await createServer();

  const api = express.Router();
  const filmRoutes = createRoutesFilm(services);
  const actorRoutes = createRoutesActor(services);
  const debugRoutes = createRoutesDebug(services);

  server.use("/api", api);
  server.use("/debug", debugRoutes);
  api.use(filmRoutes);
  api.use(actorRoutes);

  await start();
}
