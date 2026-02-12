import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n'

const { t } = i18n.global

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { titleKey: 'route.home', headerTheme: 'white' },
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/ProductListView.vue'),
      meta: { titleKey: 'route.shop', headerTheme: 'dark' },
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: { titleKey: 'route.product', headerTheme: 'dark' },
    },
    {
      path: '/art',
      name: 'art',
      component: () => import('@/views/ArtView.vue'),
      meta: { titleKey: 'route.art', headerTheme: 'white' },
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/views/MenuView.vue'),
      meta: { titleKey: 'route.menu', headerTheme: 'dark' },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/MapView.vue'),
      meta: { titleKey: 'route.map', headerTheme: 'dark' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { titleKey: 'route.cart', headerTheme: 'dark' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
      meta: { titleKey: 'route.checkout', headerTheme: 'dark' },
    },
    {
      path: '/checkout/success',
      name: 'checkout-success',
      component: () => import('@/views/OrderSuccessView.vue'),
      meta: { titleKey: 'route.checkoutSuccess', headerTheme: 'dark' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { titleKey: 'route.login', headerTheme: 'dark' },
    },
    {
      path: '/inquiry',
      name: 'inquiry',
      component: () => import('@/views/InquiryView.vue'),
      meta: { titleKey: 'route.inquiry', headerTheme: 'dark' },
    },
    {
      path: '/inquiry/success',
      name: 'inquiry-success',
      component: () => import('@/views/InquirySuccessView.vue'),
      meta: { titleKey: 'route.inquirySuccess', headerTheme: 'dark' },
    },
  ],
})

router.beforeEach((to) => {
  const key = to.meta.titleKey as string
  document.title = key ? t(key) : t('route.home')
})

export default router
