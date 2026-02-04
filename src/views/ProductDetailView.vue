<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products } from '@/data/products'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = computed(() => products.find((p) => p.id === route.params.id))

const quantity = ref(1)

function increase() {
  quantity.value++
}

function decrease() {
  if (quantity.value > 1) quantity.value--
}

function addToCart() {
  if (!product.value) return
  cartStore.addItem(
    {
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      originalPrice: product.value.originalPrice,
      image: product.value.image,
    },
    quantity.value
  )
}

function buyNow() {
  addToCart()
  router.push('/cart')
}
</script>

<template>
  <div v-if="product" class="flex flex-col pt-[120px] lg:flex-row lg:pt-[140px]">
    <!-- Sidebar (same as PL) -->
    <aside class="hidden w-[220px] border-r border-gray-200 px-6 py-8 lg:block">
      <h3 class="mb-4 text-lg font-bold">商品類別</h3>
      <ul>
        <li>
          <RouterLink to="/shop" class="block py-2 text-sm text-gray-600 hover:text-primary">
            所有商品
          </RouterLink>
        </li>
      </ul>
    </aside>

    <!-- Product Detail -->
    <div class="flex-1 px-6 py-4 lg:px-10 lg:py-8">
      <!-- Breadcrumb -->
      <div class="mb-6 text-sm text-gray-500">
        <RouterLink to="/" class="hover:text-primary">首頁</RouterLink>
        <span class="mx-1">/</span>
        <RouterLink to="/shop" class="hover:text-primary">所有商品</RouterLink>
        <span class="mx-1">/</span>
        <span>{{ product.name }}</span>
      </div>

      <!-- Product Info -->
      <section class="mb-10 flex flex-col gap-8 lg:flex-row">
        <!-- Image -->
        <div class="lg:w-1/2">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full rounded-lg object-cover"
          />
        </div>

        <!-- Details -->
        <div class="lg:w-1/2">
          <h2 class="mb-4 text-xl font-bold lg:text-2xl">| {{ product.name }} | 冷凍寄送 |</h2>

          <div class="mb-4 flex items-center gap-3">
            <span class="text-gray-400 line-through">原價 ${{ product.originalPrice }}</span>
            <span class="text-xl font-bold text-primary">特價 ${{ product.price }}</span>
          </div>

          <p v-if="product.description" class="mb-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {{ product.description }}
          </p>

          <p class="mb-6 text-sm text-gray-500">
            貨到付款 信用卡支付 ATM櫃員機
            <br />
            超商條碼 超商代碼
          </p>

          <!-- Quantity -->
          <div class="mb-6 flex items-center gap-4">
            <button
              class="flex h-10 w-10 items-center justify-center rounded border border-gray-300 text-lg transition-colors hover:bg-gray-100"
              @click="decrease"
            >
              -
            </button>
            <span class="w-8 text-center text-lg">{{ quantity }}</span>
            <button
              class="flex h-10 w-10 items-center justify-center rounded border border-gray-300 text-lg transition-colors hover:bg-gray-100"
              @click="increase"
            >
              +
            </button>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              class="flex-1 rounded bg-black py-3 text-center text-white transition-colors hover:bg-primary"
              @click="buyNow"
            >
              直接購買
            </button>
            <button
              class="flex-1 rounded border border-black py-3 text-center transition-colors hover:bg-gray-100"
              @click="addToCart"
            >
              加入購物車
            </button>
          </div>
        </div>
      </section>

      <!-- Product Specs -->
      <section v-if="product.specs" class="border-t border-gray-200 pt-8">
        <h3 class="mb-4 text-lg font-bold">商品介紹</h3>
        <div class="mb-4 text-sm leading-relaxed text-gray-600">
          <p>過敏原:本產品含有黃豆製品</p>
          <p>金黃細緻,濃醇豆香</p>
          <p>純素</p>
          <p>堅持不添加化學消泡劑</p>
          <p>100%國產非基因改造黃豆</p>
        </div>

        <h4 class="mb-3 font-bold">規格與注意事項</h4>
        <div class="mb-4">
          <h5 class="mb-2 font-semibold">商品規格</h5>
          <div class="text-sm leading-relaxed text-gray-600">
            <p v-for="(spec, i) in product.specs" :key="i">{{ spec }}</p>
          </div>
        </div>

        <div v-if="product.nutrition">
          <h5 class="mb-2 font-semibold">營養標示</h5>
          <div class="text-sm leading-relaxed text-gray-600">
            <p v-for="(n, i) in product.nutrition" :key="i">{{ n }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Product not found -->
  <div v-else class="flex min-h-[50vh] items-center justify-center pt-[140px]">
    <div class="text-center">
      <p class="mb-4 text-lg text-gray-500">找不到此商品</p>
      <RouterLink to="/shop" class="text-primary hover:underline">回到商品列表</RouterLink>
    </div>
  </div>
</template>
