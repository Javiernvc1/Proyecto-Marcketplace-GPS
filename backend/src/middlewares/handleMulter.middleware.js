import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// storage: Configuracion de almacenamiento en memoria
const storage = multer.memoryStorage();
  
// limits: Limite de tamano de archivo (5MB)
const limits = { fileSize: 1024 * 1024 * 5 };

// filtro: Funcion de fultro para permitir solo archivos de imagen (PNG, JPEG, JPG)
const filtro = (req, file, cb) => {
    if(file && (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

// Configuración de Multer
const subirImagen = multer({
    storage: storage,
    fileFilter: filtro,
    limits
});

export {subirImagen};