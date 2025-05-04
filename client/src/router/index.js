// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import PeriodList from '../views/PeriodList.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { 
    path: '/period', 
    name: 'Period', 
    component: PeriodList, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Eğer route "auth gerektiriyorsa" ve token yoksa => login'e yönlendir
  if (to.meta.requiresAuth && !token) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
