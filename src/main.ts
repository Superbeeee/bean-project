import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from './stores/auth'
import { asset } from './utils/asset'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$asset = asset

app.use(pinia)
app.use(i18n)
app.use(router)

const authStore = useAuthStore()
authStore.init().then(() => {
  app.mount('#app')
})
