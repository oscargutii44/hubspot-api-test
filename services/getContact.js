// services/getContact.js
// Importamos la instancia de conexión a la API de HubSpot
import hubspotConnection from "../hubspotConnection.js";

/**
 * Función asíncrona para obtener un contacto por su ID
 * @param {string} contactId - ID del contacto que queremos obtener
 */
export async function getContactById(contactId) {
  try {
    // Hacemos una solicitud GET al endpoint de contactos con el ID específico
    const response = await hubspotConnection.get(
      `/crm/v3/objects/contacts/${contactId}`,
      {
        params: {
          // Indicamos qué campos del contacto queremos traer
          properties: "firstname,lastname,email,phone",
        },
      }
    );

    // Si la solicitud es exitosa, devolvemos un objeto con éxito y los datos del contacto
    return { success: true, contact: response.data };
  } catch (error) {
    // Si ocurre un error, devolvemos un objeto con éxito en falso y el mensaje de error
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
