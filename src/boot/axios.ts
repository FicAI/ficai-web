import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside the
// "export default () => {}" function below (which runs individually
// for each client)
const signals_api = axios.create({
  baseURL: 'http://localhost:8080/v1',
  withCredentials: true,
});

// todo default error handler with popups

const web_api = axios.create({ baseURL: 'http://127.0.0.1:8080/v1' });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$signals_api = signals_api;
  app.config.globalProperties.$web_api = web_api;
});

export { signals_api, web_api };
