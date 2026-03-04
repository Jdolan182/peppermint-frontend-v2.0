import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//set api url
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
axios.defaults.headers.common['Access-Control-Allow-Origin', '*#']

const peppermint = createApp(App)

peppermint.use(createPinia())
peppermint.use(router)

peppermint.mount('#app')
