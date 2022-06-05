import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/', component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/IndexPage.vue'), meta: {requiresAuth: true} },
      { path: 'auth/', component: () => import('pages/auth/AuthPage.vue'), children: [
          { path: '', redirect: { name: 'login' }},
          { path: 'login', name: 'login', component: () => import('pages/auth/LoginView.vue') },
          { path: 'register', name: 'register', component: () => import('pages/auth/RegisterView.vue') },
        ]},
      { path: 'tag-me', name: 'tag-me', component: () => import('pages/FicTagPage.vue'), meta: {requiresAuth: true}},
    ]},
  // 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
