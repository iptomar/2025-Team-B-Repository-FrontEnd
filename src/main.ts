import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createWebHistory, createRouter } from 'vue-router'
import Login from './pages/Login.vue'

const routes = [
  { path: '/', component: Login },
]

const router = createRouter({
  history: createWebHistory(), // Use Web History for a standard app
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
