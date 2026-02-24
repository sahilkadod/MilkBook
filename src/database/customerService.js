import { getDBConnection } from './db';

export const addCustomer = (name, phone, address) => {
  const db = getDBConnection();

  db.execute(
    `INSERT INTO customers (name, phone, address, created_at)
     VALUES (?, ?, ?, datetime('now'))`,
    [name, phone, address]
  );
};

export const getCustomers = () => {
  const db = getDBConnection();

  const result = db.execute(
    `SELECT * FROM customers ORDER BY id DESC`
  );

  return result.rows._array;
};