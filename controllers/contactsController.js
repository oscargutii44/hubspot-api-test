import { getAllContacts } from "../services/getContacts.js";
import { createContact } from "../services/createContact.js";

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
