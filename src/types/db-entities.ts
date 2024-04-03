export type FilmDbEntity = {
  id: number;
  name: string;
};

export type ActorDbEntity = {
  id: number;
  name: string;
};

export type RelActorFilmDbEntity = {
  actor_id: number;
  film_id: number;
};
