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


export const getCategories = async () => {
    try{
        const response = await axios.get("/categories", { headers: getAuthHeaders() })
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const createCategory = async (categoryData) => {
    try{
        const response = await axios.post("categories/", categoryData, headers)
        return response

    } catch (error) {
        console.log("FRONTEND: Error en category.service -> createCategory",error);
    }
}

export const deleteCategory = async (categoryId) => {
    try{
        const response = await axios.delete(`categories/${categoryId}`)
        return response
    } catch (error) {
        console.log(error);
    }
}

export const updateCategory = async (categoryId, categoryData) => {
    try{
        const response = await axios.put(`categories/${categoryId}`, categoryData, headers)
        return response
    }
    catch (error) {
        console.log(error);
    }
}

export const getCategory = async (categoryId) => {
    try{
        const response = await axios.get(`categories/${categoryId}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

