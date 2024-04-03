import { injector, resolver } from "../di-mechanism";

import { ActorServiceProvider } from "./actor.service/provider";
import { FilmServiceProvider } from "./film.service/provider";

const ServicesProvider = injector(
  {
    actorService: ActorServiceProvider,
    filmService: FilmServiceProvider,
  },
  (reinject) => reinject
);

export const servicesResolver = () => resolver(ServicesProvider);

export type ServicesResolved = Awaited<ReturnType<typeof servicesResolver>>;
