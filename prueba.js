// Importamos funciones y conexiones necesarias
import { getAllContacts } from "../services/getContacts.js"; // Servicio para obtener todos los contactos desde HubSpot
import hubspotConnection from "../Connections/hubspotConnection.js"; // Cliente HTTP configurado para consumir la API de HubSpot

//  Normaliza un email: elimina espacios y lo convierte a minúsculas
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Corrige errores comunes de escritura en dominios de correo
function fixCommonDomainTypos(email) {
  return email
    .replace(/gmail\.co$/, "gmail.com")
    .replace(/hotmal\.com$/, "hotmail.com");
}

// Compara si dos emails son equivalentes después de normalizar y corregir errores
function emailsAreSimilar(email1, email2) {
  return (
    fixCommonDomainTypos(normalizeEmail(email1)) ===
    fixCommonDomainTypos(normalizeEmail(email2))
  );
}

//  Combina los datos del contacto principal con sus duplicados
//   - Conserva el nombre y apellido del principal (o toma del primero duplicado si faltan)
//   - Combina todos los teléfonos sin repetirlos
//   - Toma el monto_de_inversion más alto entre los duplicados
function combineData(main, duplicates) {
  return {
    firstname:
      main.properties.firstname || duplicates[0]?.properties.firstname || "",
    lastname:
      main.properties.lastname || duplicates[0]?.properties.lastname || "",
    phone: [
      ...new Set(
        [
          main.properties.phone,
          ...duplicates.map((c) => c.properties.phone),
        ].filter(Boolean) // Filtra valores vacíos o nulos
      ),
    ].join(", "), // Une los teléfonos en un solo string separados por coma
    monto_de_inversion: Math.max(
      ...[
        main.properties.monto_de_inversion,
        ...duplicates.map((c) => c.properties.monto_de_inversion),
      ].filter(Boolean)
    ),
  };
}

// Actualiza los datos de un contacto existente en HubSpot
async function updateContact(contactId, data) {
  return hubspotConnection.patch(`/crm/v3/objects/contacts/${contactId}`, {
    properties: data,
  });
}

// Elimina un contacto duplicado en HubSpot
async function deleteContact(contactId) {
  return hubspotConnection.delete(`/crm/v3/objects/contacts/${contactId}`);
}

// Función principal: unifica contactos duplicados en HubSpot
async function unifyContacts() {
  // 1️ Obtener todos los contactos desde HubSpot
  const allContactsResult = await getAllContacts();
  if (!allContactsResult.success) throw new Error(allContactsResult.error);
  const contacts = allContactsResult.contacts;

  // Set para no procesar el mismo email más de una vez
  const processedEmails = new Set();

  // 2️ Recorrer todos los contactos
  for (const contact of contacts) {
    // Normalizamos el email actual
    const emailNorm = fixCommonDomainTypos(
      normalizeEmail(contact.properties.email)
    );

    // Si ya fue procesado, saltamos
    if (processedEmails.has(emailNorm)) continue;

    // Buscamos otros contactos con email similar
    const similarContacts = contacts.filter((c) =>
      emailsAreSimilar(c.properties.email, emailNorm)
    );

    // Si no hay duplicados, marcamos como procesado y seguimos
    if (similarContacts.length <= 1) {
      processedEmails.add(emailNorm);
      continue;
    }

    // 3️ Determinar el contacto principal (el de menor ID)
    const mainContact = similarContacts.reduce((prev, curr) =>
      curr.id < prev.id ? curr : prev
    );

    // 4️ Filtrar duplicados (todos menos el principal)
    const duplicates = similarContacts.filter((c) => c.id !== mainContact.id);

    // 5️ Combinar datos y actualizar el contacto principal
    await updateContact(mainContact.id, combineData(mainContact, duplicates));

    // 6️ Eliminar los duplicados
    for (const dup of duplicates) await deleteContact(dup.id);

    // Marcar el email como procesado
    processedEmails.add(emailNorm);
  }
}

// 🔹 Ejecutar el proceso de unificación y capturar errores
unifyContacts().catch((err) => console.error("Error:", err.message));
