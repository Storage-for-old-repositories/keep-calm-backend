import sqlite3 from "sqlite3";
import { open } from "sqlite";

import { injector } from "../di-mechanism";

async function provider() {
  const db = await open({
    filename: "./database/database.sqlite",
    driver: sqlite3.verbose().Database,
  });

  db.migrate({
    migrationsPath: "./migrations",
  });

  return db;
}

export const DatabaseProvider = injector({}, async () => {
  const database = await provider();
  return database;
});
