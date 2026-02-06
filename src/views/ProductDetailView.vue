<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useProducts } from '@/composables/useProducts'
import { useProductI18n } from '@/composables/useProductI18n'
import type { Product } from '@/data/products'

const { t } = useI18n()
const { productName, productDescription } = useProductI18n()
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { getProductById, fetchProducts } = useProducts()

const product = ref<Product | null>(null)
const loading = ref(true)
const quantity = ref(1)

async function loadProduct(id: string) {
  loading.value = true
  product.value = await getProductById(id)
  loading.value = false
}

onMounted(async () => {
  await fetchProducts()
  await loadProduct(route.params.id as string)
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    quantity.value = 1
    await loadProduct(newId as string)
  }
})

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
  <!-- Loading -->
  <div v-if="loading" class="flex min-h-[50vh] items-center justify-center pt-[140px]">
    <p class="text-gray-400">{{ t('common.loading') }}</p>
  </div>

  <div v-else-if="product" class="flex flex-col pt-[120px] lg:flex-row lg:pt-[140px]">
    <!-- Sidebar (same as PL) -->
    <aside class="hidden w-[220px] border-r border-gray-200 px-6 py-8 lg:block">
      <h3 class="mb-4 text-lg font-bold">{{ t('shop.categoryTitle') }}</h3>
      <ul>
        <li>
          <RouterLink to="/shop" class="block py-2 text-sm text-gray-600 hover:text-primary">
            {{ t('common.allProducts') }}
          </RouterLink>
        </li>
      </ul>
    </aside>

    <!-- Product Detail -->
    <div class="flex-1 px-6 py-4 lg:px-10 lg:py-8">
      <!-- Breadcrumb -->
      <div class="mb-6 text-sm text-gray-500">
        <RouterLink to="/" class="hover:text-primary">{{ t('common.home') }}</RouterLink>
        <span class="mx-1">/</span>
        <RouterLink to="/shop" class="hover:text-primary">{{ t('common.allProducts') }}</RouterLink>
        <span class="mx-1">/</span>
        <span>{{ productName(product.id, product.name) }}</span>
      </div>

      <!-- Product Info -->
      <section class="mb-10 flex flex-col gap-8 lg:flex-row">
        <!-- Image -->
        <div class="lg:w-1/2">
          <img
            :src="product.image"
            :alt="productName(product.id, product.name)"
            class="w-full rounded-lg object-cover"
          />
        </div>

        <!-- Details -->
        <div class="lg:w-1/2">
          <h2 class="mb-4 text-xl font-bold lg:text-2xl">| {{ productName(product.id, product.name) }} | {{ t('product.frozenShipping') }} |</h2>

          <div class="mb-4 flex items-center gap-3">
            <span class="text-gray-400 line-through">{{ t('common.originalPrice') }} ${{ product.originalPrice }}</span>
            <span class="text-xl font-bold text-primary">{{ t('common.salePrice') }} ${{ product.price }}</span>
          </div>

          <p v-if="product.description" class="mb-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {{ productDescription(product.id, product.description) }}
          </p>

          <p class="mb-6 text-sm text-gray-500">
            {{ t('product.paymentMethods') }}
            <br />
            {{ t('product.paymentMethods2') }}
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
              {{ t('product.buyNow') }}
            </button>
            <button
              class="flex-1 rounded border border-black py-3 text-center transition-colors hover:bg-gray-100"
              @click="addToCart"
            >
              {{ t('product.addToCart') }}
            </button>
          </div>
        </div>
      </section>

      <!-- Product Specs -->
      <section v-if="product.specs" class="border-t border-gray-200 pt-8">
        <h3 class="mb-4 text-lg font-bold">{{ t('product.introTitle') }}</h3>
        <div class="mb-4 text-sm leading-relaxed text-gray-600">
          <p>{{ t('product.introAllergen') }}</p>
          <p>{{ t('product.introGolden') }}</p>
          <p>{{ t('product.introVegan') }}</p>
          <p>{{ t('product.introNoChemical') }}</p>
          <p>{{ t('product.introNonGMO') }}</p>
        </div>

        <h4 class="mb-3 font-bold">{{ t('product.specsTitle') }}</h4>
        <div class="mb-4">
          <h5 class="mb-2 font-semibold">{{ t('product.specsSubtitle') }}</h5>
          <div class="text-sm leading-relaxed text-gray-600">
            <p v-for="(spec, i) in product.specs" :key="i">{{ spec }}</p>
          </div>
        </div>

        <div v-if="product.nutrition">
          <h5 class="mb-2 font-semibold">{{ t('product.nutritionTitle') }}</h5>
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
      <p class="mb-4 text-lg text-gray-500">{{ t('product.notFound') }}</p>
      <RouterLink to="/shop" class="text-primary hover:underline">{{ t('product.backToList') }}</RouterLink>
    </div>
  </div>
</template>
