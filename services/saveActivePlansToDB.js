// services/saveActivePlansToDB.js
import db from "../Connections/dbConnection.js";

export async function saveActivePlansToDB(activePlans) {
  const query = `
    INSERT INTO active_plans_combined
      (plan_id, contact_id, property_id, total, payments, status, customer_name, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      total = VALUES(total),
      payments = VALUES(payments),
      status = VALUES(status),
      customer_name = VALUES(customer_name),
      email = VALUES(email)
  `;

  for (const plan of activePlans) {
    const parsedTotal = Number(String(plan.total).replace(/,/g, ""));
    await db.execute(query, [
      plan.plan_id,
      plan.contact_id,
      plan.property_id,
      parsedTotal,
      plan.payments,
      plan.status,
      plan.customer_name,
      plan.email,
    ]);
  }

  console.log(`✅ Se sincronizaron ${activePlans.length} planes activos`);
}
