import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/auth';

export default boot(async({ router }) => {
  const auth = useAuthStore();

  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)){
      if (!auth.isLoggedIn){
        next({name: 'login', query: { next: to.fullPath } });
      }
      else {
        next();
      }
    }
    else {
      next();
    }
  })
});
