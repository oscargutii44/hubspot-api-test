import { showActivePlansTable } from "../views/showActivePlansView.js";

try {
  await showActivePlansTable();
  console.log("✅ Test completado");
} catch (error) {
  console.error("❌ Test falló:", error);
}
