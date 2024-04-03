--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE film (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE actor (
  id INTEGER PRIMARY KEY,
  name VARCHAR(1024) UNIQUE
);

CREATE TABLE rel_actor_film (
  actor_id INTEGER REFERENCES actor(id),
  film_id INTEGER REFERENCES film(id),
  PRIMARY KEY (actor_id, film_id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE film;

DROP TABLE actor;

DROP TABLE rel_actor_film;