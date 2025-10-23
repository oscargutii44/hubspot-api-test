import {
  handleContacts,
  handleCreateContact,
} from "./controllers/contactsController.js";
import { showContacts } from "./views/consoleView.js";

async function main() {
  try {
    console.log("Creando un nuevo contacto en HubSpot...\n");

    const newContact = await handleCreateContact({
      firstname: "Canelita",
      lastname: "Sierra",
      email: "canelita@gmail.com",
    });

    console.log("✅ Contacto creado exitosamente:");
    console.log(newContact);

    console.log("\nObteniendo contactos de HubSpot...\n");
    const contacts = await handleContacts();
    showContacts(contacts);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
