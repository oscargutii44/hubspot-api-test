// views/showActivePlansView.js
import { getActivePlans } from "../services/getActivePlans.js";
import Table from "cli-table3";

/**
 * View que obtiene los planes activos combinados
 * y los muestra en consola en formato de tabla sin columna de índice,
 * con total parseado y normalizado a moneda.
 */
export async function showActivePlansTable() {
  try {
    console.log("🔄 Cargando planes activos combinados...\n");

    const activePlans = await getActivePlans();

    if (!activePlans || !activePlans.length) {
      console.log("⚠️ No se encontraron planes activos.");
      return;
    }

    console.log("✅ Planes activos con clientes:\n");

    // Configuramos la tabla
    const table = new Table({
      head: [
        "Plan_ID",
        "Contact_ID",
        "Propiedad",
        "Total",
        "Pagos",
        "Estatus",
        "Cliente",
        "Email",
      ],
      colWidths: [10, 15, 15, 15, 7, 10, 20, 25],
      wordWrap: true,
    });

    // Agregamos los datos
    activePlans.forEach((plan) => {
      // Parseamos y normalizamos la moneda
      const parsedTotal = Number(String(plan.total).replace(/,/g, ""));
      const formattedTotal = `$${parsedTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      table.push([
        plan.plan_id,
        plan.contact_id,
        plan.property_id,
        formattedTotal,
        plan.payments,
        plan.status,
        plan.customer_name,
        plan.email,
      ]);
    });

    // Mostramos la tabla en consola
    console.log(table.toString());
  } catch (error) {
    console.error("❌ Error mostrando planes activos:", error);
  }
}
