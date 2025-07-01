
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Configuración base para todas las peticiones
const baseConfig: AxiosRequestConfig = {
  baseURL: `${import.meta.env.PUBLIC_API_URL}`
  // timeout: 10000, // 10 segundos
};

// Creamos una instancia de Axios con la configuración base
const axiosInstance: AxiosInstance = axios.create(baseConfig);

// Interceptor para las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    //todo Add token logic
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    // Puedes procesar la respuesta antes de pasarla al código que la solicitó
    return response;
  },
  (error) => {
    // Aquí puedes manejar errores globalmente
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('Error de solicitud:', error.request);
    } else {
      // Algo sucedió en la configuración de la solicitud que provocó un error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Interfaz para los métodos de la API
export interface Api {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// Implementación de la interfaz Api
const api: Api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<T, AxiosResponse<T>>(url, config).then(response => response.data),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.post<T, AxiosResponse<T>>(url, data, config).then(response => response.data),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.put<T, AxiosResponse<T>>(url, data, config).then(response => response.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.delete<T, AxiosResponse<T>>(url, config).then(response => response.data),
};

export default api;