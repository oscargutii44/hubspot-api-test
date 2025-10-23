import {
  handleContacts,
  handleCreateContact,
  handleGetContact,
} from "./controllers/contactsController.js";
import { showContacts } from "./views/consoleView.js";

async function main() {
  try {
    // 1️ Crear un contacto
    console.log("Creando un nuevo contacto en HubSpot...\n");

    const newContact = await handleCreateContact({
      firstname: "Marcelo",
      lastname: "Vieira",
      email: "m12@gmail.com",
    });

    console.log("Contacto creado exitosamente:");
    console.log(newContact);

    // 2️ Traer todos los contactos
    console.log("\nObteniendo todos los contactos de HubSpot...\n");
    const contacts = await handleContacts();
    showContacts(contacts);

    // 3️ Recuperar un contacto específico por ID
    // Reemplaza con un ID válido de HubSpot (puede ser el del contacto que acabamos de crear)
    const contactId = newContact.id;
    console.log(`\nRecuperando contacto específico con ID: ${contactId}\n`);
    const contact = await handleGetContact(contactId);

    console.log("Contacto recuperado:");
    console.log(contact);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
