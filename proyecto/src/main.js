import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import 'leaflet/dist/leaflet.css'
import { useAuth } from './stores/auth.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
const auth = useAuth()
if (auth.token && auth.user) {
    auth.loadUser()
}
