// services/sendDealToHubspot.js
import hubspotDealsAPI from "../Connections/hubspotDealsConnection.js";
import { stageMap } from "./dealStageMap.js";

export async function sendDealToHubspot(deal) {
  try {
    const stage = stageMap[deal.status.replace("-", "_")];

    if (!stage) {
      console.log(`❌ Stage no mapeado para deal ${deal.id}: ${deal.status}`);
      return;
    }

    const body = {
      properties: {
        dealname: deal.name,
        amount: deal.total,
        dealstage: stage,
        pipeline: "default", // o tu pipeline interno si es otro
      },
    };

    const response = await hubspotDealsAPI.post("", body);
    console.log(`✅ Deal enviado a HubSpot: ${deal.id}`, response.data.id);
    return response.data.id;
  } catch (error) {
    if (error.response) {
      console.log(`❌ No se pudo enviar deal ${deal.id}:`, error.response.data);
    } else {
      console.log(`❌ Error al enviar deal ${deal.id}:`, error.message);
    }
  }
}
