// Importamos la función getAllContacts desde la carpeta de servicios
// Esta función se encarga de obtener todos los contactos desde la API
import { getAllContacts } from "../services/getContacts.js";
import { createContact } from "../services/createContact.js";
import { getContactById } from "../services/getContact.js";

// Definimos una función asíncrona que maneja la obtención de contactos
export async function handleContacts() {
  const result = await getAllContacts();
  if (!result.success) throw new Error(result.error);
  return result.contacts;
}

// Nuevo controlador para crear contactos
export async function handleCreateContact(contactData) {
  const result = await createContact(contactData);
  if (!result.success) throw new Error(result.error);
  return result.contact;
}

/**
 * Controlador para recuperar un contacto por ID
 */
export async function handleGetContact(contactId) {
  const result = await getContactById(contactId);
  if (!result.success) throw new Error(result.error);
  return result.contact;
}
