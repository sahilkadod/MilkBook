import { getDBConnection } from './db';

// Save or update rate
export const setLatestRate = async (month, year, rate) => {
  try {
    const db = getDBConnection();

    db.execute(
      `INSERT INTO monthly_rates (month, year, rate)
       VALUES (?, ?, ?)
       ON CONFLICT(month, year) DO UPDATE SET rate = excluded.rate`,
      [month, year, rate]
    );

    return true;
  } catch (error) {
    console.log('Set rate SQL error:', error);
    return false;
  }
};

// Get rate
export const getLatestRate = async (month, year) => {
  try {
    const db = getDBConnection();

    const result = db.execute(
      `SELECT rate FROM monthly_rates WHERE month = ? AND year = ?`,
      [month, year]
    );

    if (result.rows && result.rows.length > 0) {
      return result.rows.item(0).rate;
    }

    return 0;
  } catch (error) {
    console.log('Get rate SQL error:', error);
    return 0;
  }
};