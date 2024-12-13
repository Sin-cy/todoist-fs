import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(":memory:")

// Execute SQL statements from strings
// INFO: the users table needs to be able to reference from other tables so we set the PRIMARY KEY
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`)

// INFO: Every todo must also have its unique id so we set it as PRIMARY KEY as well
db.exec(`
    CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`)

export default db;
