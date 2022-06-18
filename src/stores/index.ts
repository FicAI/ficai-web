import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';

import resetStore from 'stores/reset-store.js';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  // noinspection UnnecessaryLocalVariableJS
  const pinia = createPinia();

  // You can add Pinia plugins here
  pinia.use(resetStore);
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
