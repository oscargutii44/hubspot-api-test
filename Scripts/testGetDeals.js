// Scripts/testGetDeals.js
import { getNewDeals } from "../services/getDeal.js";
import db from "../Connections/dbConnection.js";

async function testGetDeals() {
  try {
    const deals = await getNewDeals();
    console.log(`📦 ${deals.length} deals nuevos encontrados:`);

    deals.forEach((deal) => {
      console.table({
        id: deal.id,
        name: deal.name,
        total: deal.total,
        status: deal.status,
      });
    });
  } catch (err) {
    console.error("❌ Error al leer deals de MySQL:", err.message);
  } finally {
    await db.end();
    console.log("🔌 Conexión MySQL cerrada");
  }
}

testGetDeals();
