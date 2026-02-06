<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'

const { products, categories, loading, error, fetchProducts, fetchCategories } = useProducts()

const activeCategory = ref('all')

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return products.value
  return products.value.filter((p) => p.category === activeCategory.value)
})

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<template>
  <div class="flex flex-col pt-[120px] lg:flex-row lg:pt-[140px]">
    <!-- Sidebar -->
    <aside class="w-full border-b border-gray-200 px-6 py-4 lg:w-[220px] lg:border-b-0 lg:border-r lg:py-8">
      <h3 class="mb-4 text-lg font-bold">商品類別</h3>
      <ul class="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
        <li v-for="cat in categories" :key="cat.id">
          <button
            class="block w-full cursor-pointer rounded px-3 py-2 text-left text-sm transition-colors hover:text-primary lg:rounded-none lg:px-0"
            :class="activeCategory === cat.id ? 'font-bold text-primary' : 'text-gray-600'"
            @click="activeCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </li>
      </ul>
    </aside>

    <!-- Product Grid -->
    <div class="flex-1 px-6 py-4 lg:px-10 lg:py-8">
      <!-- Breadcrumb -->
      <div class="mb-6 text-sm text-gray-500">
        <RouterLink to="/" class="hover:text-primary">首頁</RouterLink>
        <span class="mx-1">/</span>
        <span>所有商品</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <p class="text-gray-400">載入商品中...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex items-center justify-center py-20">
        <p class="text-red-500">{{ error }}</p>
      </div>

      <!-- Products -->
      <ul v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        <li v-for="product in filteredProducts" :key="product.id">
          <RouterLink
            :to="`/product/${product.id}`"
            class="group block no-underline"
          >
            <div class="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                :src="product.image"
                :alt="product.name"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h3 class="mb-1 text-sm font-medium text-gray-900 lg:text-base">
              {{ product.name }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400 line-through">
                原價 ${{ product.originalPrice }}
              </span>
              <span class="text-sm font-bold text-primary">
                特價 ${{ product.price }}
              </span>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
