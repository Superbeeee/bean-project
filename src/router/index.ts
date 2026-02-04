import { createRouter, createWebHistory } from 'vue-router'

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
      meta: { title: '豆之間 Soybean Space', headerTheme: 'white' },
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/ProductListView.vue'),
      meta: { title: '線上購買', headerTheme: 'dark' },
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: { title: '商品詳情', headerTheme: 'dark' },
    },
    {
      path: '/art',
      name: 'art',
      component: () => import('@/views/ArtView.vue'),
      meta: { title: '線上探索豆間', headerTheme: 'white' },
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/views/MenuView.vue'),
      meta: { title: '豆間菜單', headerTheme: 'dark' },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/MapView.vue'),
      meta: { title: '尋找豆間', headerTheme: 'dark' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { title: '購物車', headerTheme: 'dark' },
    },
    {
      path: '/inquiry',
      name: 'inquiry',
      component: () => import('@/views/InquiryView.vue'),
      meta: { title: '企業大宗詢問', headerTheme: 'dark' },
    },
    {
      path: '/inquiry/success',
      name: 'inquiry-success',
      component: () => import('@/views/InquirySuccessView.vue'),
      meta: { title: '表單送出', headerTheme: 'dark' },
    },
  ],
})

router.beforeEach((to) => {
  document.title = (to.meta.title as string) || '豆之間 Soybean Space'
})

export default router
