import { open } from 'react-native-quick-sqlite';

let db;

export const getDBConnection = () => {
    if (!db) {
        db = open({ name: 'milkbook.db' });
    }
    return db;
};

export const createTables = () => {
    const database = getDBConnection();

    database.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      created_at TEXT
    );
  `);
    database.execute(`
  CREATE TABLE IF NOT EXISTS milk_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    date TEXT,
    morning_liter REAL,
    morning_fat REAL,
    evening_liter REAL,
    evening_fat REAL,
    created_at TEXT
  );
`);
};