import Database from 'better-sqlite3';
const dbPath = process.env.DB_PATH || 'website.db';
export const db = new Database(dbPath);
// Initialize schema
export function initDb() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
