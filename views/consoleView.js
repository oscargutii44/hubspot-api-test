// Función que muestra en consola la lista de contactos recibidos
export function showContacts(contacts) {
  // Si el arreglo de contactos está vacío, mostramos un mensaje y salimos de la función
  if (!contacts.length) {
    console.log("No se encontraron contactos.");
    return;
  }

  // Si hay contactos, mostramos un encabezado con la cantidad encontrada
  console.log(`\n=== ${contacts.length} CONTACTOS ENCONTRADOS ===\n`);

  // Mostramos los contactos en formato de tabla para que se vea más ordenado en la consola
  console.table(
    // Usamos .map() para transformar cada contacto y mostrar solo las propiedades deseadas
    contacts.map((c) => ({
      ID: c.id, // ID del contacto
      Nombre: c.properties.firstname, // Nombre del contacto
      Apellido: c.properties.lastname, // Apellido del contacto
      Email: c.properties.email, // Correo electrónico del contacto
    }))
  );
}
