// Importamos la función handleContacts desde la capa de controladores
// Esta función se encarga de obtener los contactos desde el servicio
import { handleContacts } from "./controllers/contactsController.js";

// Importamos la función showContacts desde la capa de vistas
// Esta función muestra los contactos en la consola de forma legible
import { showContacts } from "./views/consoleView.js";

// Definimos la función principal que ejecutará el flujo del programa
async function main() {
  console.log("Obteniendo contactos de HubSpot...\n");

  try {
    // Llamamos a la función que obtiene los contactos desde la API
    const contacts = await handleContacts();

    // Mostramos los contactos obtenidos en la consola
    showContacts(contacts);
  } catch (error) {
    // Si ocurre algún error durante el proceso, lo mostramos en consola
    console.error("Error:", error.message);
  }
}

// Ejecutamos la función principal
main();
