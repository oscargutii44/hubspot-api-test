// services/getContact.js
import hubspotConnection from "../hubspotConnection.js";

/**
 * Obtener un contacto por ID
 */
export async function getContactById(contactId) {
  try {
    const response = await hubspotConnection.get(
      `/crm/v3/objects/contacts/${contactId}`,
      {
        params: {
          properties: "firstname,lastname,email,phone", // Campos que quieras traer
        },
      }
    );

    return { success: true, contact: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
