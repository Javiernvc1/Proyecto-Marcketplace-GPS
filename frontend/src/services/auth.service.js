import axios from './root.service';
import cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post('auth/login', {
      email,
      password,
    });
    const { status, data } = response;
   
    if (status === 200) {
      const { email, role, id } = await jwtDecode(data.data.accessToken);
      console.log(email, role, id);
      localStorage.setItem('user', JSON.stringify( { email, role, id } ));
      axios.defaults.headers.common[ 'Authorization'] = `Bearer ${ data.data.accessToken }`;
      cookies.set('jwt-auth', data.data.accessToken, { path: '/' });
      return true;
  }
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  cookies.remove('jwt');
};

export const test = async () => {
  try {
    const response = await axios.get('/users');
    const { status, data } = response;
    if (status === 200) {
      console.log(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};
