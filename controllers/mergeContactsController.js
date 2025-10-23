// controllers/mergeContactsController.js
import { getAllContacts } from "../services/getContacts.js";
import { mergeContacts } from "../services/mergeContacts.js";

/**
 * Controlador para unificar duplicados en HubSpot
 */
export async function handleMergeDuplicates() {
  try {
    // Obtener todos los contactos
    const result = await getAllContacts();
    if (!result.success) throw new Error(result.error);
    const contactos = result.contacts;

    // Normalizar emails y teléfonos
    const normalizados = contactos.map((c) => ({
      ...c,
      email: c.email?.trim().toLowerCase(),
      telefono: c.phone?.replace(/[\s\-\(\)]/g, ""),
    }));

    // Agrupar contactos por email
    const grupos = normalizados.reduce((acc, c) => {
      if (!c.email) return acc;
      if (!acc[c.email]) acc[c.email] = [];
      acc[c.email].push(c);
      return acc;
    }, {});

    // Fusionar duplicados
    for (const email in grupos) {
      const grupo = grupos[email];
      if (grupo.length > 1) {
        const principal = grupo[0].id; // Elegir el principal (puedes cambiar criterio)
        const duplicados = grupo.slice(1).map((c) => c.id);
        await mergeContacts(principal, duplicados);
        console.log(`Duplicados de ${email} fusionados en ${principal}`);
      }
    }

    return { success: true, message: "Duplicados fusionados correctamente" };
  } catch (error) {
    throw new Error(`Error al unificar duplicados: ${error.message}`);
  }
}
