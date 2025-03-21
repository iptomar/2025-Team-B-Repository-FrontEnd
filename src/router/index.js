import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import Main from '@/components/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      //component: ,
    },
    {
      path: '/about',
      name: 'about',
      //component: () => 
    },
    {
      path: '/lmao',
      name: 'lmao',
      component:  Main,
      
    },
  ],
})

export default router
