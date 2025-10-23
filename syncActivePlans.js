// syncActivePlans.js
import { getActivePlans } from "./services/getActivePlans.js";
import { saveActivePlansToDB } from "./services/saveActivePlansToDB.js";

async function sync() {
  try {
    const activePlans = await getActivePlans();
    if (!activePlans || !activePlans.length) {
      console.log("⚠️ No hay planes activos para sincronizar");
      return;
    }
    await saveActivePlansToDB(activePlans);
  } catch (error) {
    console.error("❌ Error sincronizando planes activos:", error);
  }
}

sync();
