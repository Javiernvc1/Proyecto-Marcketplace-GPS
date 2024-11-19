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

export const createPost = async(postData) => {
    try {
        const response = await axios.post("/posts/", postData, { headers: getAuthHeaders() });
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> createPost", error);
    }
}

export const getPosts = async() => {
    try {
        const response = await axios.get("/posts/", { headers: getAuthHeaders() })
        console.log("FRONTEND: getPosts -> response.data.data", response.data.data);
        return response.data.data
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> getPosts", error);

    }
}
export const getPostById = async(postId) => {
    try {
        const response = await axios.get(`/posts/${postId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> getPostById", error);
    }
}

export const getUserPosts = async (id) => {
    try {
      const response = await axios.get(`/posts/user/${id}`);
      return response.data; // Asumiendo que la respuesta tiene los datos en response.data
    } catch (error) {
      console.error('Error al obtener publicaciones del usuario:', error);
    }
  };

export const updatePost = async( postId, editedPost ) =>{
    try {
        const response = await axios.put(`/posts/${postId}`, editedPost)
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> updatePost", error);
    }
}

export const deletePost = async(postId) => {
    try {
        const response = await axios.delete(`/posts/${postId}`, )
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> getPosts", error);

    }
}


export const savePostAsFavorite = async( postId, userId) => {
    try {
        const response = await axios.post(`/posts/favorite/${postId}`, {userId});
        return response;
    } catch (error) {
      console.log("FRONTEND: Error en post.service -> savePostAsFavorite", error);
    }
}
  

export const getUserFavoritePosts = async(userId) =>{
    try {
        const response = await axios.get(`/posts/getUserFavoritePosts/${userId}`);
        return response;
    } catch (error) {
      console.log("FRONTEND: Error en post.service -> getUserFavoritePosts", error);
    }
}

export const getPostByCategory = async(categoryId) => {
    try {
        const response = await axios.get(`/posts/category/${categoryId}`);
        return response;
    }
    catch (error) {
        console.log("FRONTEND: Error en post.service -> getPostByCategory", error);
    }
}