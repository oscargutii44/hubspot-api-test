// Importamos la instancia de conexión a la API de HubSpot
// Esta conexión ya incluye la URL base y las credenciales necesarias
import hubspotConnection from "../Connections/hubspotConnection.js";

// Función asíncrona para obtener todos los contactos desde HubSpot
export async function getAllContacts() {
  try {
    // Arreglo donde se guardarán todos los contactos obtenidos
    const contacts = [];
    // Variable para manejar la paginación de HubSpot
    let after = null;

    // Hacemos peticiones mientras haya más páginas de contactos
    do {
      // Solicitamos los contactos a la API
      const response = await hubspotConnection.get("/crm/v3/objects/contacts", {
        params: { limit: 100, after }, // Limitamos a 100 contactos por página y enviamos token de paginación
        timeout: 5000, // Timeout de 5 segundos por cada petición
      });

      // Extraemos los resultados y la información de paginación
      const { results, paging } = response.data;
      // Agregamos los contactos obtenidos al arreglo general
      contacts.push(...results);
      // Actualizamos el token 'after' para la siguiente página, si existe
      after = paging?.next?.after;
    } while (after);

    // Retornamos un objeto indicando éxito y la lista de contactos
    return { success: true, contacts };
  } catch (error) {
    // Si ocurre un timeout, devolvemos un mensaje específico
    if (error.code === "ECONNABORTED") {
      return {
        success: false,
        error: "Timeout: la API de HubSpot tardó demasiado",
      };
    }
    // En cualquier otro error, devolvemos el mensaje de la API o el error general
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
