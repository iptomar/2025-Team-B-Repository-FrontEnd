
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createWebHistory, createRouter } from 'vue-router';
import Login from './pages/Login.vue';
import Salas from './pages/Salas.vue';
import AdminSpace from './pages/AdminSpace.vue';
import Cursos from './pages/Cursos.vue';
import Turma from "@/pages/Turma.vue"

const routes = [
  { path: "/", component: Login },
  { path: "/signalR/:id", component: Turma},
  {
    path: "/salas",
    component: Salas,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    component: AdminSpace,
    meta: { requiresAuth: true },
  },
  {
    path: "/cursos",
    component: Cursos,
    meta: { requiresAuth: true },
  },
  {
    path: "/curso/:id",
    name: "CursoDetalhes",
    meta: { requiresAuth: true },
    component: () => import("./pages/CursoDetalhes.vue"),
  },
  {
    path: "/turma/:id",
    name: "Turma",
    meta: { requiresAuth: true },
    component: () => import("./pages/Turma.vue"),
  },
  {
    path: "/cadeira/:id",
    name: "Cadeira",
    meta: { requiresAuth: true },
    component: () => import("./pages/Cadeira.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) { 
    next("/");
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.mount("#app");
