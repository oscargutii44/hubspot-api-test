// Importamos la instancia de conexión a la API de HubSpot
import hubspotConnection from "../hubspotConnection.js";

// Función asíncrona para crear un nuevo contacto en HubSpot
// Recibe un objeto 'contactData' con las propiedades del contacto
export async function createContact(contactData) {
  try {
    // Hacemos una solicitud POST al endpoint de contactos
    // Enviamos las propiedades del nuevo contacto en el cuerpo de la solicitud
    const response = await hubspotConnection.post("/crm/v3/objects/contacts", {
      properties: contactData,
    });

    // Si la operación es exitosa, devolvemos un objeto con el estado y el contacto creado
    return { success: true, contact: response.data };
  } catch (error) {
    // Si ocurre un error, devolvemos un objeto con el estado y el mensaje del error
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
