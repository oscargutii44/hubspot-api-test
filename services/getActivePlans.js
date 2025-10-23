// services/getActivePlans.js
import db from "../Connections/dbConnection.js";
import { getContactById } from "./getContact.js"; // tu servicio HubSpot

export async function getActivePlans() {
  try {
    // 1️⃣ Traer los planes activos desde MySQL
    const [plans] = await db.execute(
      "SELECT * FROM planes WHERE status = 'activo';"
    );

    // 2️⃣ Por cada plan, traer info del contacto de HubSpot y combinar
    const mergedPlans = await Promise.all(
      plans.map(async (plan) => {
        try {
          const contact = await getContactById(plan.contact_id);

          return {
            ...plan,
            customer_name: contact
              ? `${contact.firstName} ${contact.lastName}`
              : null,
            email: contact ? contact.email : null,
          };
        } catch (error) {
          console.error(`Error obteniendo contacto ${plan.contact_id}:`, error);
          return { ...plan, customer_name: null, email: null };
        }
      })
    );

    return mergedPlans;
  } catch (error) {
    console.error("Error obteniendo planes activos:", error);
    throw error;
  }
}
