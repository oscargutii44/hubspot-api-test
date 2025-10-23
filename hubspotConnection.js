// Importamos la librería axios para hacer solicitudes HTTP
import axios from "axios";
// Importamos dotenv para poder usar variables de entorno desde un archivo .env
import dotenv from "dotenv";

// Cargamos las variables de entorno definidas en el archivo .env
dotenv.config();

// Creamos una instancia de conexión a la API de HubSpot usando axios
const hubspotConnection = axios.create({
  // URL base de la API de HubSpot
  baseURL: "https://api.hubapi.com",
  // Encabezados que se enviarán en cada solicitud
  headers: {
    // Autenticación con token de acceso almacenado en una variable de entorno
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    // Indicamos que enviaremos y recibiremos datos en formato JSON
    "Content-Type": "application/json",
  },
});

// Exportamos la instancia para poder reutilizarla en otros archivos
export default hubspotConnection;
