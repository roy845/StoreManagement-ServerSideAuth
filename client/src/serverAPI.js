import axios from "axios";
const BASE_URL = "http://localhost:8800/";

const API_URLS = {
  login: `${BASE_URL}api/auth/login`,
  register: `${BASE_URL}api/auth/register`,
  getUserAdminRoutes: `${BASE_URL}api/auth/userOrAdminRoutes`,
  getAdminRoutes: `${BASE_URL}api/auth/adminRoutes`,
};

export const login = (username, password) => {
  try {
    return axios.post(API_URLS.login, { username, password });
  } catch (error) {
    throw error;
  }
};

export const register = (username, password) => {
  try {
    return axios.post(API_URLS.register, { username, password });
  } catch (error) {
    throw error;
  }
};

export const getAdminRoutes = () => {
  try {
    return axios.get(API_URLS.getAdminRoutes);
  } catch (error) {
    throw error;
  }
};
export const getUserAdminRoutes = () => {
  try {
    return axios.get(API_URLS.getUserAdminRoutes);
  } catch (error) {
    throw error;
  }
};

export default API_URLS;
