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
axios.defaults.headers.common['Access-Control-Allow-Origin', '*#']

const peppermint = createApp(App)

peppermint.use(createPinia())
peppermint.use(router)

peppermint.mount('#app')
