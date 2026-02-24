import { getDBConnection } from './db';

export const addMilkEntry = async (customerId, date, mLiter, mFat, eLiter, eFat) => {
    const db = getDBConnection();
    await db.execute(
        `INSERT INTO milk_entries
      (customer_id, date, morning_liter, morning_fat, evening_liter, evening_fat, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [customerId, date, mLiter, mFat, eLiter, eFat]
    );
};

export const getMilkEntriesByCustomer = (customerId) => {
    const db = getDBConnection();

    const result = db.execute(
        `SELECT * FROM milk_entries
     WHERE customer_id = ?
     ORDER BY date DESC`,
        [customerId]
    );
    return result.rows._array;
};
export const updateMilkEntry = async (entryId, mLiter, mFat, eLiter, eFat) => {
    const db = getDBConnection();
    await db.execute(
        `UPDATE milk_entries
     SET morning_liter = ?, morning_fat = ?, evening_liter = ?, evening_fat = ?
     WHERE id = ?`,
        [mLiter, mFat, eLiter, eFat, entryId]
    );
};
