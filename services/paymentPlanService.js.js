import hubspotConnection from "../Connections/hubspotConnection.js";
import { getActivePlans } from "./getActivePlans.js";
import { logger } from "./logger.js";

/**
 * Sincroniza los planes de pago de ADMIN con HubSpot
 * y los asocia con Contactos y Propiedades
 */
export async function syncPaymentPlansService() {
  try {
    // 1. Obtener planes activos desde ADMIN / DB
    const plans = await getActivePlans();

    for (const plan of plans) {
      // 2. Preparar payload para HubSpot
      const payload = {
        properties: {
          plan_id: plan.plan_id.toString(),
          contact_id: plan.contact_id.toString(),
          property_id: plan.property_id.toString(),
          total: plan.total,
          payments: plan.payments,
          status: plan.status,
          fecha_inicio: plan.fecha_inicio,
        },
      };

      // 3. Revisar si el plan ya existe en HubSpot (usando plan_id)
      let hubspotPlan;
      try {
        const searchRes = await hubspotConnection.crm.objects.basicApi.getById(
          "plan_de_pago", // tu objeto personalizado
          plan.plan_id.toString()
        );
        // Si existe, actualizamos
        hubspotPlan = await hubspotConnection.crm.objects.basicApi.update(
          "plan_de_pago",
          plan.plan_id.toString(),
          payload
        );
      } catch (error) {
        // Si no existe, lo creamos
        hubspotPlan = await hubspotConnection.crm.objects.basicApi.create(
          "plan_de_pago",
          payload
        );
      }

      const planId = hubspotPlan.id;

      // 4. Asociar con Contacto
      if (plan.contact_id) {
        try {
          await hubspotConnection.crm.objects.associationsApi.create(
            "plan_de_pago",
            planId,
            "contacts",
            plan.contact_id.toString(),
            "plan_to_contact"
          );
        } catch (err) {
          logger.error(
            `Error asociando plan ${planId} con contacto ${plan.contact_id}:`,
            err
          );
        }
      }

      // 5. Asociar con Propiedad
      if (plan.property_id) {
        try {
          await hubspotConnection.crm.objects.associationsApi.create(
            "plan_de_pago",
            planId,
            "properties",
            plan.property_id.toString(),
            "plan_to_property"
          );
        } catch (err) {
          logger.error(
            `Error asociando plan ${planId} con propiedad ${plan.property_id}:`,
            err
          );
        }
      }
    }

    logger.info(`Planes de pago sincronizados: ${plans.length}`);
  } catch (err) {
    logger.error("Error sincronizando planes de pago:", err);
  }
}
