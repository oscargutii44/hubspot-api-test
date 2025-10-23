// Scripts/syncActivePlans.js
import { getActivePlans } from "../services/getActivePlans.js";
import { saveActivePlansToDB } from "../services/saveActivePlansToDB.js";

export async function syncActivePlans() {
  try {
    console.log("🔄 Iniciando sincronización de planes activos...");

    // 1️⃣ Traer los planes activos validados por HubSpot
    const activePlans = await getActivePlans();

    if (!activePlans.length) {
      console.log("⚠️ No hay planes válidos para sincronizar.");
      return;
    }

    // 2️⃣ Guardar/actualizar los planes en la tabla combinada
    const syncedCount = await saveActivePlansToDB(activePlans);

    console.log(`✅ Se sincronizaron ${syncedCount} planes activos.`);
  } catch (error) {
    console.error("❌ Error en la sincronización de planes:", error.message);
  }
}

// Permite ejecutar el script directamente con node
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await syncActivePlans();
  })();
}
