// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css';
import axios from 'axios'

createApp(App).use(router).mount('#app')


axios.defaults.baseURL = 'http://localhost:3000/api'
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
