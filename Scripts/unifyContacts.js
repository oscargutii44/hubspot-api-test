/**
 * Script completo para unificar contactos duplicados en HubSpot
 * - Detecta contactos con emails iguales o similares
 * - Normaliza emails y corrige errores comunes de dominio
 * - Combina datos de duplicados en un solo contacto principal
 * - Elimina los duplicados restantes
 */

import { getAllContacts } from "../services/getContacts.js";
import hubspotConnection from "../Connections/hubspotConnection.js";

/** -----------------------
 * Funciones de normalización y comparación
 * ------------------------ */

// Normaliza emails: quita espacios y convierte a minúsculas
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Corrige errores comunes de dominios
function fixCommonDomainTypos(email) {
  return email
    .replace(/gmail\.co$/, "gmail.com") // Corrige ".co" a ".com"
    .replace(/hotmal\.com$/, "hotmail.com"); // Corrige errores típicos
}

// Compara si dos emails son "similares"
function emailsAreSimilar(email1, email2) {
  return (
    fixCommonDomainTypos(normalizeEmail(email1)) ===
    fixCommonDomainTypos(normalizeEmail(email2))
  );
}

/** -----------------------
 * Función para combinar datos de contactos duplicados
 * ------------------------ */
function combineData(main, duplicates) {
  return {
    // Nombre: toma el del principal o del primer duplicado
    firstname:
      main.properties.firstname || duplicates[0]?.properties.firstname || "",
    // Apellido: igual
    lastname:
      main.properties.lastname || duplicates[0]?.properties.lastname || "",
    // Teléfonos: combina todos distintos en una cadena separada por coma
    phone: [
      ...new Set(
        [
          main.properties.phone,
          ...duplicates.map((c) => c.properties.phone),
        ].filter(Boolean)
      ),
    ].join(", "),
    // Monto de inversión: toma el máximo
    monto_de_inversion: Math.max(
      ...[
        main.properties.monto_de_inversion,
        ...duplicates.map((c) => c.properties.monto_de_inversion),
      ].filter(Boolean)
    ),
  };
}

/** -----------------------
 * Funciones de actualización y eliminación en HubSpot
 * ------------------------ */

// Actualiza un contacto existente en HubSpot
async function updateContact(contactId, data) {
  return hubspotConnection.patch(`/crm/v3/objects/contacts/${contactId}`, {
    properties: data,
  });
}

// Elimina un contacto en HubSpot
async function deleteContact(contactId) {
  return hubspotConnection.delete(`/crm/v3/objects/contacts/${contactId}`);
}

/** -----------------------
 * Función principal de unificación avanzada
 * ------------------------ */
async function unifyContacts() {
  console.log("🚀 Obteniendo todos los contactos...");

  // Obtenemos todos los contactos desde la API
  const allContactsResult = await getAllContacts();
  if (!allContactsResult.success) throw new Error(allContactsResult.error);

  const contacts = allContactsResult.contacts;

  // Set para evitar procesar el mismo email más de una vez
  const processedEmails = new Set();

  // Iteramos sobre todos los contactos
  for (const contact of contacts) {
    // Normalizamos el email del contacto
    const emailNorm = fixCommonDomainTypos(
      normalizeEmail(contact.properties.email)
    );

    // Si ya procesamos este email, saltamos
    if (processedEmails.has(emailNorm)) continue;

    // Buscamos todos los contactos con emails similares
    const similarContacts = contacts.filter((c) =>
      emailsAreSimilar(c.properties.email, emailNorm)
    );

    // Si solo hay uno, no hay duplicados
    if (similarContacts.length <= 1) {
      processedEmails.add(emailNorm);
      continue;
    }

    // Mostramos los emails que vamos a unificar
    console.log(
      `🔹 Unificando contactos similares: ${similarContacts
        .map((c) => c.properties.email)
        .join(", ")}`
    );

    // Elegimos contacto principal (ID más bajo)
    const mainContact = similarContacts.reduce((prev, curr) =>
      curr.id < prev.id ? curr : prev
    );

    // Los demás son duplicados
    const duplicates = similarContacts.filter((c) => c.id !== mainContact.id);

    // Combinamos los datos
    const combinedData = combineData(mainContact, duplicates);

    // Actualizamos contacto principal
    await updateContact(mainContact.id, combinedData);
    console.log(`✅ Contacto principal actualizado: ${mainContact.id}`);

    // Eliminamos los duplicados
    for (const dup of duplicates) {
      await deleteContact(dup.id);
      console.log(`🗑 Eliminado contacto duplicado: ${dup.id}`);
    }

    // Marcamos el email como procesado
    processedEmails.add(emailNorm);
  }

  console.log("✨ Unificación avanzada completada.");
}

/** -----------------------
 * Ejecutamos la función principal y manejamos errores
 * ------------------------ */
unifyContacts().catch((err) => console.error("❌ Error:", err.message));
