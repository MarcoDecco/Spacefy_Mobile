import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const authService = {
  login: async (email, password) => {
    // Faz a requisição de login
    const response = await api.post("/auth/login", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    return response.data;
  },
  
  register: async (userData) =>{
    // Faz a requisição de registro
    const response = await api.post("/users/createUser", userData);
    return response.data;
  },
  
  logout: async () => {
    // Remove o token do AsyncStorage
    await AsyncStorage.removeItem("token");
  },
};
