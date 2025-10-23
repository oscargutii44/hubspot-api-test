// Importamos la conexión configurada a la API de HubSpot
// Esta conexión ya incluye la URL base y las credenciales necesarias
import hubspotConnection from "../hubspotConnection.js";

// Definimos una función asíncrona para obtener todos los contactos desde HubSpot
export async function getAllContacts() {
  try {
    // Creamos un arreglo vacío donde guardaremos todos los contactos
    const contacts = [];
    // La variable 'after' se usa para manejar la paginación de la API
    // (HubSpot devuelve los resultados en páginas de 100 registros por defecto)
    let after = null;

    // Usamos un ciclo do...while para hacer varias peticiones
    // mientras existan más páginas de contactos por obtener
    do {
      // Realizamos una solicitud GET al endpoint de contactos de HubSpot
      const response = await hubspotConnection.get("/crm/v3/objects/contacts", {
        // Enviamos como parámetros el límite y el token 'after' (si existe)
        params: { limit: 100, after },
      });

      // Desestructuramos los resultados y la información de paginación
      const { results, paging } = response.data;

      // Agregamos los contactos obtenidos al arreglo general
      contacts.push(...results);

      // Si hay una página siguiente, actualizamos el valor de 'after'
      after = paging?.next?.after;
    } while (after); // El ciclo continúa mientras haya más páginas

    // Si todo salió bien, devolvemos un objeto con éxito y la lista de contactos
    return { success: true, contacts };
  } catch (error) {
    // Si ocurre un error, devolvemos un objeto con el estado y el mensaje del error
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
