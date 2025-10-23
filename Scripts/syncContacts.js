// Scripts/syncContacts.js
import { handleMergeDuplicates } from "../controllers/mergeContactsController.js";

async function main() {
  console.log("🚀 Iniciando unificación de duplicados en HubSpot...");
  await handleMergeDuplicates();
  console.log("✨ Unificación completada.");
}

main();
