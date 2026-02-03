// src/services/api.ts
import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: "repeat", // <-- remove os []
      skipNulls: true,
      filter: (_, value) => {
        if (Array.isArray(value) && value.length === 0) {
          return undefined; // não envia array vazio
        }
        return value;
      },
    }),
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
