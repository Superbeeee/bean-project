import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from './stores/auth'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(i18n)    // 必須在 router 之前，router.beforeEach 才能正確呼叫 t()
app.use(router)

const authStore = useAuthStore()
authStore.init().then(() => {
  app.mount('#app')
})
