import axios from "./root.service";
import cookies from 'js-cookie';
const headers = {
    'Content-Type': 'multipart/form-data'
  };
  const getAuthHeaders = () => {
    const token = cookies.get('jwt-auth'); // Obtén el token de autenticación de las cookies
    return {
        ...headers,
        'Authorization': `Bearer ${token}`
    };
};

export const register = async (formData) => {
    try {

        return axios.post("users/", formData, { headers })

    } catch (error) {
        console.log("FRONTEND: Error en user.service -> register",error);
    }
}

export const getUserByEmail = async (email) => {
    try {
        const response = await axios.get(`users/email/${email}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.log("FRONTEND: Error en user.service -> getUserByEmail", error);
    }
}

export const getUserInformation = async (id) => {
    try {
        return axios.get(`users/${id}`);
    } catch (error) {
        console.log("FRONTEND: Error en user.service -> getUserInformation()");
    }
};

export const getUserImage = async (id) => {
    try {
        const response = await axios.get(`users/getUserImageByID/${id}`, {
            responseType: 'arraybuffer' // Indica a axios que la respuesta es un array de bytes
        });
        // Convierte los datos binarios en un base64 string
        const base64String = Buffer.from(response.data, 'binary').toString('base64');
        // Construye la URL de la imagen usando el base64 string
        const imageUrl = `data:image/jpeg;base64,${base64String}`;
        return imageUrl;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Si el servidor devuelve un 404, significa que el usuario no tiene imagen de perfil
            return null; // Puedes retornar una URL de imagen predeterminada en su lugar
        } else {
            console.log("FRONTEND: Error en user.service -> getUserImage()", error);
            throw error; // Lanza el error para que pueda ser manejado en el componente
        }
    }
};

export const updateUser = async(id, editedProfile) => {
    try {
        const response = await axios.put(`users/${id}`, editedProfile)
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en user.service -> updateUser()");
    }
}

/*export const getUserFollowedHashtags = async (id) => {
    try {
        return axios.get(`users/getUserFollowedHashtags/${id}`);
    } catch (error) {
        console.log("FRONTEND: Error en user.service -> getUserFollowedHashtags()");
    }
}



export const followUser = async( idFollowed, idFollower) => {
   try {
        const response = await axios.post(`users/followUser/${idFollowed}`, {idFollower});
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en user.service -> followUser()", error);
    }
}*/
