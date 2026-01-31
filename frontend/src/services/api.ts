// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor para ADICIONAR o token em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@App:token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para TRATAR erros globais (Ex: Token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Se a API retornar 401 (Não autorizado), limpamos o local e deslogamos
      localStorage.removeItem("@App:token");
      window.location.href = "/"; // Redireciona para o login
    }
    return Promise.reject(error);
  },
);

export default api;
