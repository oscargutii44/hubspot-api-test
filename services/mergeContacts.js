// services/mergeContacts.js
import hubspotConnection from "../Connections/hubspotConnection.js";

/**
 * Fusiona una lista de contactos duplicados en un contacto principal
 * @param {string} primaryId - ID del contacto principal
 * @param {Array<string>} duplicateIds - IDs de los contactos duplicados
 */
export async function mergeContacts(primaryId, duplicateIds) {
  for (const id of duplicateIds) {
    await hubspotConnection.post("/crm/v3/objects/contacts/merge", {
      primaryObjectId: primaryId,
      objectIdToMerge: id,
    });
    console.log(`✅ Contacto ${id} fusionado en ${primaryId}`);
  }
}
