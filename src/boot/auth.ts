import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/auth';

export default boot(async({ router }) => {
  const auth = useAuthStore();

  router.beforeEach(async (to, from) => {
    if (to.matched.some(record => record.meta.requiresAuth)){
      if (!await auth.checkAuth()){
        return {name: 'login', query: { next: to.fullPath } };
      }
    }
  })
});
