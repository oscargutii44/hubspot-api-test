// Función que muestra en consola la lista de contactos o un solo contacto
export function showContacts(contacts) {
  // Si se recibe un solo objeto en lugar de un arreglo, lo convertimos en arreglo de un elemento
  if (!Array.isArray(contacts)) {
    contacts = [contacts];
  }

  // Si el arreglo de contactos está vacío, mostramos un mensaje y salimos de la función
  if (!contacts.length) {
    console.log("No se encontraron contactos.");
    return;
  }

  // Mostramos un encabezado indicando la cantidad de contactos encontrados
  console.log(`\n=== ${contacts.length} CONTACTOS ENCONTRADOS ===\n`);

  // Mostramos los contactos en formato de tabla en la consola
  console.table(
    contacts.map((c) => ({
      ID: c.id, // ID del contacto
      Nombre: c.properties?.firstname || "-", // Nombre del contacto o '-' si no existe
      Apellido: c.properties?.lastname || "-", // Apellido del contacto o '-' si no existe
      Email: c.properties?.email || "-", // Correo electrónico o '-' si no existe
    }))
  );
}
