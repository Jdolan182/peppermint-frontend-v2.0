import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//set api url
import axios from "axios";
import { config } from '@/config'
axios.defaults.baseURL = config.apiUrl + '/';
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

// After a deploy, an open tab still references the previous build's hashed
// chunk files, which no longer exist — lazy-loaded routes then fail silently
// (nav clicks appear dead). Reload once to pick up the new build.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  window.location.reload()
})

const peppermint = createApp(App)

peppermint.use(createPinia())
peppermint.use(router)

peppermint.mount('#app')
