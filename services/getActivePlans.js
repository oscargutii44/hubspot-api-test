// services/getActivePlans.js
import db from "../dbConnection.js";

export async function getActivePlans() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM planes WHERE status = 'activo';"
    );
    return rows;
  } catch (error) {
    console.error("Error obteniendo planes activos:", error);
    throw error;
  }
}
