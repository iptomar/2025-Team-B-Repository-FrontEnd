import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createWebHistory, createRouter } from 'vue-router';
import Login from './pages/Login.vue';
import Dashboard from './pages/Dashboard.vue';
import Rooms from './pages/Rooms.vue';
import Schedules from './pages/Schedules.vue';
import Degrees from './pages/Degrees.vue';
import Teachers from './pages/Teachers.vue';
import Users from './pages/Users.vue';
import Settings from './pages/Settings.vue';

const routes = [
  { path: '/', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/schedules',
    component: Schedules,
    meta: { requiresAuth: true }
  },
  {
    path: '/rooms',
    component: Rooms,
    meta: { requiresAuth: true }
  },
  {
    path: '/degrees',
    component: Degrees,
    meta: { requiresAuth: true }
  },
  {
    path: '/teachers',
    component: Teachers,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    component: Users,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.mount('#app');