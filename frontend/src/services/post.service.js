import axios from "./root.service";

const headers = {
    'Content-Type': 'multipart/form-data'
  };

export const createPost = async(postData) => {
    try {
        const response = await axios.post("/posts/", postData, headers);
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> createPost", error);
    }
}

export const getPosts = async() => {
    try {
        const response = await axios.get("/posts/")
        return response.data
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> getPosts", error);

    }
}

/*export const getPost = async(id) =>{
    try {
        const response = await axios.get(`/posts/getPostByID/${id}`)
        return response.data
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> getPost", error);
    }
}*/

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