import fs from "fs";
import Database from "better-sqlite3";

class UserRepository {
  private db: Database.Database;

  constructor(dbFilePath: string) {
    this.db = new Database(dbFilePath);
    this.runMigrations();
  }

  //Apply migrations to create the table
  runMigrations() {
    const runMigration = (path: string) => {
      const migrationFile = fs.readFileSync(path, "utf8");
      this.db.exec(migrationFile);
    };

    const TestIfExistTable = this.db
      .prepare(
        "SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'users'"
      )
      .get();
    if (!TestIfExistTable) {
      const migrations = ["db/migrations/init.sql"];
      migrations.forEach(runMigration);
    }
  }

  //Authenticate user
  authenticateUser(username: string, password: string) {
    const user = this.db
      .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
      .get(username, password);
    if (user) {
      return { status: "SUCCESS", message: user };
    } else {
      return { status: "ERROR", message: "User was not found !" };
    }
  }

  //Create user
  createUser(id: string, email: string, password: string) {
    const userToAdd = this.db
      .prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)")
      .run(id, email, password);
    if (userToAdd) {
      return { status: "SUCCESS", message: userToAdd.lastInsertRowid };
    } else {
      return { status: "SUCCESS", message: "User was not created !" };
    }
  }
}

export default UserRepository;
