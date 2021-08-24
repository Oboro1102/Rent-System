import { createApp } from 'vue'
import "./assets/css/bootstrap-reboot.min.css"
import App from './App.vue'
import store from './store'
import router from './router'

createApp(App).use(router).use(store).mount('#app')
