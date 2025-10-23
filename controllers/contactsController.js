// Importamos la función getAllContacts desde la carpeta de servicios
// Esta función se encarga de obtener todos los contactos desde la API
import { getAllContacts } from "../services/getContacts.js";

// Definimos una función asíncrona que maneja la obtención de contactos
export async function handleContacts() {
  // Esperamos la respuesta de la función getAllContacts()
  // Esta función devuelve un objeto con el estado de la operación (success, error, contacts)
  const result = await getAllContacts();

  // Si la propiedad 'success' es falsa, significa que hubo un error al obtener los contactos
  // En ese caso, lanzamos un error con el mensaje recibido
  if (!result.success) {
    throw new Error(result.error);
  }

  // Si todo salió bien, devolvemos la lista de contactos obtenidos
  return result.contacts;
}
