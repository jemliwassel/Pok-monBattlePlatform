import Database from "better-sqlite3";
import fs from "fs";
import { User } from "../models/user";
// import { User } from './model' //← not needed right now

export default class UserRepository {
  db: Database.Database;

  constructor() {
    this.db = new Database("db/authentication.db", { verbose: console.log });
    this.applyMigrations();
  }

  //Table creation
  applyMigrations() {
    const applyMigration = (path: string) => {
      const migration = fs.readFileSync(path, "utf8");
      this.db.exec(migration);
    };

    const testRow = this.db
      .prepare(
        "SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'users'"
      )
      .get();

    if (!testRow) {
      console.log("Applying migrations on DB users...");
      const migrations = ["db/migrations/init.sql"];
      migrations.forEach(applyMigration);
    }
  }

  // login user
  authenticateUser(email: string, password: string) {
    const user = this.db
      .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
      .get(email, password);
    if (user) {
      return { status: "success", result: user };
    } else {
      return { status: "error", message: "user not found" };
    }
  }

  // add user
  createUser(id: string, email: string, password: string) {
    const user = this.db
      .prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)")
      .run(id, email, password);
    console.log(user);
    if (user) {
      return { status: "success", result: user.lastInsertRowid };
    }

    return { status: "error", message: "user not created" };
  }
}
