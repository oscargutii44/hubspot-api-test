// services/getActivePlans.js
import db from "../Connections/dbConnection.js";
import { getContactById } from "./getContact.js"; // Servicio que consulta HubSpot por contact_id

export async function getActivePlans() {
  try {
    // 1️ Obtener los planes activos desde la base de datos MySQL (ADMIN)
    const [plans] = await db.execute(
      "SELECT * FROM planes WHERE status = 'activo';"
    );

    // 2️ Evitar llamadas repetidas a HubSpot creando un Set con contact_id únicos
    const uniqueContactIds = [...new Set(plans.map((plan) => plan.contact_id))];

    // 3️ Por cada plan activo, consultar la API de HubSpot mediante contact_id
    const contactMap = {};
    await Promise.all(
      uniqueContactIds.map(async (id) => {
        try {
          // Aquí se hace la consulta directa a HubSpot
          const contact = await getContactById(id);
          // Se guarda la respuesta (nombre, email, etc.) en un mapa
          contactMap[id] = contact || null;
        } catch (error) {
          // Si falla la consulta o el contacto no existe, se marca como null
          console.error(`Error obteniendo contacto ${id}:`, error);
          contactMap[id] = null;
        }
      })
    );

    // 4️ Combinar la información del plan con la del contacto (merge)
    const mergedPlans = plans.map((plan) => {
      const contact = contactMap[plan.contact_id];
      return {
        ...plan, // datos del plan desde MySQL
        customer_name: contact
          ? `${contact.firstName} ${contact.lastName}`
          : null,
        email: contact ? contact.email : null,
      };
    });

    // 5️ Filtrar los planes cuyo contacto no exista en HubSpot
    const validPlans = mergedPlans.filter(
      (plan) => plan.customer_name !== null
    );

    // 6️ Devolver los planes activos ya validados y combinados
    return validPlans;
  } catch (error) {
    console.error("Error obteniendo planes activos:", error);
    throw error;
  }
}
