// services/getDeal.js
import db from "../Connections/dbConnection.js";

export async function getDealById(dealId) {
  const [rows] = await db.execute(
    "SELECT id, name, total, status, hubspot_id FROM deals WHERE id = ?",
    [dealId]
  );
  return rows[0] || null;
}

export async function getAllDeals() {
  const [rows] = await db.execute(
    "SELECT id, name, total, status, hubspot_id FROM deals"
  );
  return rows;
}

export async function getNewDeals() {
  const [rows] = await db.execute(
    "SELECT id, name, total, status FROM deals WHERE hubspot_id IS NULL"
  );
  return rows;
}
