import { syncPaymentPlansService } from "../services/paymentPlanService.js";

(async () => {
  console.log("Sincronizando planes de pago con HubSpot...");
  await syncPaymentPlansService();
})();
