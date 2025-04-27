
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createWebHistory, createRouter } from 'vue-router';
import Login from './pages/Login.vue';
import Inicio from './pages/Inicio.vue';
import Salas from './pages/Salas.vue';
import Cursos from './pages/Cursos.vue';
import Professores from './pages/Professores.vue';
import Utilizadores from './pages/Utilizadores.vue';
import Definicoes from './pages/Definicoes.vue';
import CreateUtilizador from './pages/CreateUtilizador.vue';
import UpdateUtilizador from './pages/UpdateUtilizador.vue';


const routes = [
  { path: "/", component: Login },
  {
    path: "/inicio",
    component: Inicio,
    meta: { requiresAuth: true },
  },
  {
    path: "/salas",
    component: Salas,
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
    component: () => import("./pages/CursoDetalhes.vue"),
  },
  {
    path: "/turma/:id",
    name: "Turma",
    component: () => import("./pages/Turma.vue"),
  },
  {

    path: '/turma/:id',
    name: 'Turma',
    component: () => import('./pages/Cursos.vue'),
  },  
  {
    path: "/cadeira/:id",
    name: "Cadeira",
    component: () => import("./pages/Cadeira.vue"),
  },

  {
    path: "/professores",
    component: Professores,
    meta: { requiresAuth: true },
  },
  {
    path: "/utilizadores",
    component: Utilizadores,
    meta: { requiresAuth: true },
  },
  {
    path: "/definicoes",
    component: Definicoes,
    meta: { requiresAuth: true },
  },
  {
    path: '/utilizadores/create-utilizador',
    component: CreateUtilizador,
    meta: { requiresAuth: true }
  },
  {
    path: '/utilizadores/update-utilizador/:id',
    component: UpdateUtilizador,
    meta: { requiresAuth: true }
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
