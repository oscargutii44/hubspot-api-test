// services/saveActivePlansToDB.js
import db from "../Connections/dbConnection.js";

/**
 * Guarda o actualiza los planes activos en la tabla combinada.
 * Actualiza la columna last_synced con la fecha/hora actual.
 * @param {Array} plans - Arreglo de planes validados (desde getActivePlans)
 * @returns {Number} Cantidad de planes sincronizados
 */
export async function saveActivePlansToDB(plans) {
  let syncedCount = 0;

  for (const plan of plans) {
    try {
      // Usamos INSERT ... ON DUPLICATE KEY UPDATE para insertar o actualizar
      const query = `
        INSERT INTO active_plans_combined 
          (plan_id, contact_id, property_id, total, payments, status, customer_name, email, last_synced)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          property_id = VALUES(property_id),
          total = VALUES(total),
          payments = VALUES(payments),
          status = VALUES(status),
          customer_name = VALUES(customer_name),
          email = VALUES(email),
          last_synced = NOW();
      `;

      await db.execute(query, [
        plan.plan_id,
        plan.contact_id,
        plan.property_id,
        plan.total,
        plan.payments,
        plan.status,
        plan.customer_name,
        plan.email,
      ]);

      syncedCount++;
    } catch (error) {
      console.error(`❌ Error guardando plan ${plan.plan_id}:`, error.message);
    }
  }

  return syncedCount;
}
