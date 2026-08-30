import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

type DB = BetterSQLite3Database<typeof schema>;

declare global {
  // eslint-disable-next-line no-var
  var __db: DB | undefined;
}

function createDb(): DB {
  const dbPath = process.env.DATABASE_PATH ?? "data/app.db";
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const sqlite = new Database(dbPath);
  sqlite.pragma("busy_timeout = 5000");
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  return db;
}

// Connexion paresseuse : le build de Next importe les modules de pages dans
// plusieurs processus en parallèle; ouvrir (et migrer) la base à l'import
// provoquait des « database is locked ». La base ne s'ouvre qu'à la première
// requête, qui n'arrive jamais pendant le build (pages force-dynamic).
export const db: DB = new Proxy({} as DB, {
  get(_target, prop) {
    const real = (globalThis.__db ??= createDb());
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export * from "./schema";
