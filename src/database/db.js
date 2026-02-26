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

  // Customers table
  database.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      created_at TEXT
    );
  `);

  // Milk entries table
  database.execute(`
    CREATE TABLE IF NOT EXISTS milk_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      morning_liter REAL DEFAULT 0,
      morning_fat REAL DEFAULT 0,
      evening_liter REAL DEFAULT 0,
      evening_fat REAL DEFAULT 0,
      created_at TEXT,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    );
  `);

  // Monthly rates table (UNIQUE constraint for month+year)
  database.execute(`
  CREATE TABLE IF NOT EXISTS monthly_rates (
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    rate REAL NOT NULL,
    PRIMARY KEY (month, year)
  );
`);
};