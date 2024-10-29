import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid"; 



/**
 * Lee un archivo (imagen) de forma asíncrona desde el sistema de archivos y lo convierte en una cadena base64
 * @param {string} filePath - La ruta del archivo que se va a leer.
 * @returns {Promise<string|null>} - La representación base64 del archivo o null si ocurre un error.
 */
async function readFileBase64(filePath) {
  try {
    // Lee el archivo de forma asíncrona y lo convierte a base64
    const fileData = await fs.readFile(filePath);
    const base64Data = fileData.toString("base64");
    return base64Data;
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return null;
  }
};

/**
 *  Guarda la imagen de una publicación en el sistema de archivos
 * @param {Object} file  - Objeto que contiene la información del archivo de imagen.
 * @returns {Promise<String|null>} - Nombre de archivo de imagen guardado, o null si no se proporcionó ningún archivo.
 */
async function saveImagePost(file) {
  if (file) {
    const imageBuffer = file.buffer;
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;
    await fs.writeFile(`src/uploads/images/${fileName}`, imageBuffer);
    return fileName;
  }
  return null;
}

async function saveImageProfile(file) {
  if (file) {
    const imageBuffer = file.buffer;
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;
    await fs.writeFile(`src/uploads/profiles/${fileName}`, imageBuffer);
    return fileName;
  }
  return null;
}



export {
  readFileBase64,
  saveImagePost,
  saveImageProfile
};