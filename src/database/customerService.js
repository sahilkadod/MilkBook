import { getDBConnection } from './db';

// Add customer
export const addCustomer = (name, phone, address) => {
  const db = getDBConnection();

  db.execute(
    `INSERT INTO customers (name, phone, address, created_at)
     VALUES (?, ?, ?, datetime('now'))`,
    [name, phone, address]
  );
};

// Get all customers
export const getCustomers = () => {
  const db = getDBConnection();

  const result = db.execute(
    `SELECT * FROM customers ORDER BY id DESC`
  );

  return result.rows._array;
};

// Delete customer
export const deleteCustomerFromDB = (customerId) => {
  const db = getDBConnection();

  db.execute(
    `DELETE FROM customers WHERE id = ?`,
    [customerId]
  );
};

// Update customer
export const updateCustomer = (id, name, phone, address) => {
  const db = getDBConnection();

  db.execute(
    `UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?`,
    [name, phone, address, id]
  );
};