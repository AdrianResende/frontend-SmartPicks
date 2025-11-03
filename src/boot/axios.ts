import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.defaults.withCredentials = true;

// Interceptor para adicionar X-User-ID automaticamente
api.interceptors.request.use(
  (config) => {
    // Pegar o user do localStorage
    const userStr = localStorage.getItem('smartpicks_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) {
          config.headers['X-User-ID'] = user.id.toString();
        }
      } catch (error) {
        console.error('Erro ao parsear usuário do localStorage:', error);
      }
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
