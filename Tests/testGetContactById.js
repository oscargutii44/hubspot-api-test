import { getContactById } from "../services/getContact.js";

async function test() {
  const contactId = "166322677035";

  try {
    const contact = await getContactById(contactId);

    if (!contact) {
      console.log(`No se encontró el contacto con ID ${contactId}`);
    } else {
      console.log(`Contacto encontrado con ID ${contactId}:`);
      console.log(contact); // <--- ver todas las propiedades reales
    }
  } catch (error) {
    console.error("Error al obtener contacto:", error);
  }
}

test();
