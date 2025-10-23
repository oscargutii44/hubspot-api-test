// Scripts/syncDeals.js
import dotenv from "dotenv";
dotenv.config();

import db from "../Connections/dbConnection.js";
import { getNewDeals } from "../services/getDeal.js";
import { sendDealToHubspot } from "../services/sendDealToHubspot.js";

async function syncDeals() {
  try {
    console.log("✅ Conectado a MySQL");

    // 1️⃣ Obtener todos los deals sin hubspot_id
    const deals = await getNewDeals();
    console.log(`📦 ${deals.length} deals nuevos encontrados en MySQL`);

    // 2️⃣ Enviar cada deal a HubSpot
    for (const deal of deals) {
      await sendDealToHubspot(deal);
    }
  } catch (error) {
    console.log("❌ Error al sincronizar deals:", error.message);
  } finally {
    // 3️⃣ Cerrar conexión
    await db.end();
    console.log("🔌 Conexión MySQL cerrada");
  }
}

// Ejecutar la sincronización
syncDeals();
