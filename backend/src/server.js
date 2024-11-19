// Importa el archivo 'configEnv.js' para cargar las variables de entorno
import { PORT, HOST } from "./config/configEnv.js";
// Importa el módulo 'cors' para agregar los cors
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// Importa el módulo 'express' para crear la aplicacion web
import express, { urlencoded, json } from "express";
// Importamos morgan para ver las peticiones que se hacen al servidor
import morgan from "morgan";
// Importa el módulo 'cookie-parser' para manejar las cookies
import cookieParser from "cookie-parser";
/** El enrutador principal */
import indexRoutes from "./routes/index.routes.js";
// Importa el archivo 'configDB.js' para crear la conexión a la base de datos
import { setupDB } from "./config/configDB.js";
// Importa el handler de errores
import { handleFatalError, handleError } from "./utils/errorHandler.js";
import { createRoles, createUsers, createCategories } from "./config/initialSetup.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
/**
 * Inicia el servidor web
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupServer() {
  try {
    /** Instancia de la aplicacion */
    const app = express();
    app.disable("x-powered-by");
    // Agregamos los cors
    app.use(cors({ credentials: true, origin: true }));
    // Agrega el middleware para el manejo de datos en formato URL
    app.use(express.urlencoded({ extended: true }));
    // Agrega el middleware para el manejo de datos en formato JSON
    app.use(express.json());
    // Agregamos el middleware para el manejo de cookies
    app.use(cookieParser());
    // Agregamos morgan para ver las peticiones que se hacen al servidor
    app.use(morgan("dev"));
    // Agrega el enrutador principal al servidor
    app.use("/api", indexRoutes);
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    // Crear el servidor HTTP
    const server = http.createServer(app);

    // Configurar Socket.IO
    const io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado:", socket.id);

      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
      });

      socket.on("chatMessage", (msg) => {
        io.emit("chatMessage", msg);
      });
    });

    // Inicia el servidor en el puerto especificado
    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (err) {
    handleError(err, "/server.js -> setupServer");
  }
}

/**
 * Inicia la API
 */
async function setupAPI() {
  try {
    // Inicia la conexión a la base de datos
    await setupDB();
    // Inicia el servidor web
    await setupServer();
    // Inicia la creación de los roles
    await createRoles();
    // Inicia la creación del usuario admin y user
    await createUsers();
    // Inicia la creación de las categorías iniciales
    await createCategories();
  } catch (err) {
    handleFatalError(err, "/server.js -> setupAPI");
  }
}

// Inicia la API
setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((err) => handleFatalError(err, "/server.js -> setupAPI"));
