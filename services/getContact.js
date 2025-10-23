// services/getContact.js
import hubspotConnection from "../Connections/hubspotConnection.js";

/**
 * Obtiene la información de un contacto de HubSpot por su ID.
 * Devuelve solo las propiedades principales.
 */
export async function getContactById(contactId) {
  try {
    const response = await hubspotConnection.get(
      `/crm/v3/objects/contacts/${contactId}`
    );

    // Aquí están las propiedades reales dentro del objeto devuelto por HubSpot
    const properties =
      response.data.contact?.properties || response.data.properties;

    // Si el contacto no existe, devolvemos null
    if (!properties) {
      console.warn(
        `⚠️ No se encontraron propiedades para el contacto ${contactId}`
      );
      return null;
    }

    // Devolvemos solo los campos que nos interesan
    return {
      firstName: properties.firstname || null,
      lastName: properties.lastname || null,
      email: properties.email || null,
    };
  } catch (error) {
    console.error(
      `❌ Error trayendo contacto ${contactId} de HubSpot:`,
      error.response?.data || error
    );
    return null;
  }
}
