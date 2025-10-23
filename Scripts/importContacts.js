// Importamos el controlador que llama a createContact
import { handleCreateContact } from "../controllers/contactsController.js";

// Lista de contactos a subir
const contactosDePrueba = [
  {
    firstname: "JUAN",
    lastname: "PEREZ",
    email: "JUAN@GMAIL.COM",
    phone: "3121203399",
  },
  {
    firstname: "JUAN",
    lastname: "PÉREZ",
    email: "juan@gmail.com",
    phone: "3120980982",
  },
  {
    firstname: "Tommy",
    lastname: "PICKLES",
    email: "tommy@gmail.com",
    phone: "3123904854",
  },
  {
    firstname: "Tommy",
    lastname: "P.",
    email: "TOMMY@GMAIL.CO",
    phone: "3128384893",
  },
];

async function main() {
  console.log("🚀 Subiendo contactos a HubSpot...");

  for (const contacto of contactosDePrueba) {
    try {
      const result = await handleCreateContact(contacto);
      console.log("✅ Contacto creado:", result.contact.properties.email);
    } catch (error) {
      console.error("❌ Error al crear contacto:", error.message);
    }
  }

  console.log("✨ Todos los contactos se subieron correctamente.");
}

main();
