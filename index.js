// Importamos las funciones del controlador
// handleContacts: obtiene todos los contactos
// handleCreateContact: crea un nuevo contacto
// handleGetContact: obtiene un contacto por su ID
import {
  handleContacts,
  handleCreateContact,
  handleGetContact,
} from "./controllers/contactsController.js";

// Importamos la función que muestra los contactos en la consola
import { showContacts } from "./views/consoleView.js";

// Función principal que ejecuta el flujo del programa
async function main() {
  try {
    // Creamos un nuevo contacto enviando los datos al controlador
    const newContact = await handleCreateContact({
      firstname: "Eduardo",
      lastname: "Reyes",
      email: "ereyes@gmail.com",
    });
    console.log("Contacto creado exitosamente:");

    // Recuperamos un contacto específico usando el ID del contacto recién creado
    const contactId = newContact.id;
    const contact = await handleGetContact(contactId);

    // Mostramos en consola el contacto recuperado
    console.log("Contacto recuperado:");
    showContacts(contact);
  } catch (error) {
    // Si ocurre algún error durante el proceso, lo mostramos en consola
    console.error("Error:", error.message);
  }
}

// Ejecutamos la función principal
main();
