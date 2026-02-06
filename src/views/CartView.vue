<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useProductI18n } from '@/composables/useProductI18n'

const { t } = useI18n()
const { productName } = useProductI18n()
const cart = useCartStore()
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 pt-[120px] lg:pt-[140px]">
    <h1 class="mb-6 text-xl font-bold">{{ t('cart.title') }}</h1>

    <!-- Cart Table -->
    <div class="mb-8">
      <!-- Header -->
      <div class="hidden border-b border-gray-200 pb-3 lg:flex">
        <div class="flex-1 text-sm font-medium text-gray-500">{{ t('cart.headerProduct') }}</div>
        <div class="w-32 text-center text-sm font-medium text-gray-500">{{ t('cart.headerQuantity') }}</div>
        <div class="w-24 text-right text-sm font-medium text-gray-500">{{ t('cart.headerTotal') }}</div>
        <div class="w-16 text-center text-sm font-medium text-gray-500">{{ t('cart.headerDelete') }}</div>
      </div>

      <!-- Empty Cart -->
      <div v-if="cart.items.length === 0" class="py-12 text-center text-gray-400">
        <p class="mb-4">{{ t('cart.empty') }}</p>
        <RouterLink to="/shop" class="text-primary hover:underline">{{ t('cart.goShopping') }}</RouterLink>
      </div>

      <!-- Cart Items -->
      <ul class="divide-y divide-gray-100">
        <li
          v-for="item in cart.items"
          :key="item.id"
          class="flex flex-col gap-4 py-4 lg:flex-row lg:items-center"
        >
          <!-- Product -->
          <div class="flex flex-1 items-center gap-4">
            <img :src="item.image" :alt="productName(item.id, item.name)" class="h-20 w-20 rounded-lg object-cover" />
            <div>
              <p class="text-sm font-medium">{{ productName(item.id, item.name) }}</p>
              <p class="text-sm text-primary">NT.${{ item.price }}</p>
            </div>
          </div>

          <!-- Quantity -->
          <div class="flex w-32 items-center justify-center gap-2">
            <button
              class="flex h-8 w-8 items-center justify-center rounded border border-gray-300 transition-colors hover:bg-gray-100"
              @click="cart.updateQuantity(item.id, item.quantity - 1)"
            >
              -
            </button>
            <span class="w-8 text-center">{{ item.quantity }}</span>
            <button
              class="flex h-8 w-8 items-center justify-center rounded border border-gray-300 transition-colors hover:bg-gray-100"
              @click="cart.updateQuantity(item.id, item.quantity + 1)"
            >
              +
            </button>
          </div>

          <!-- Total -->
          <div class="w-24 text-right text-sm font-bold">
            NT.${{ item.price * item.quantity }}
          </div>

          <!-- Delete -->
          <div class="w-16 text-center">
            <button
              class="text-gray-400 transition-colors hover:text-red-500"
              @click="cart.removeItem(item.id)"
            >
              ✕
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Shipping -->
    <div v-if="cart.items.length > 0" class="mb-6 border-y border-gray-200 py-4">
      <label class="flex items-center gap-3">
        <input type="radio" name="delivery" checked class="accent-black" />
        <div>
          <span class="font-medium">{{ t('cart.domesticDelivery') }}</span>
          <span class="ml-2 text-sm text-gray-500">{{ t('cart.shippingByTotal') }}</span>
        </div>
      </label>
    </div>

    <!-- Remarks -->
    <div v-if="cart.items.length > 0" class="mb-6 text-sm text-gray-500">
      <ul class="list-disc space-y-1 pl-5">
        <li>{{ t('cart.remark1') }}</li>
        <li>{{ t('cart.remark2') }}</li>
        <li>{{ t('cart.remark3') }}</li>
        <li>{{ t('cart.remark4') }}</li>
      </ul>
    </div>

    <!-- Summary -->
    <div v-if="cart.items.length > 0" class="mb-8 rounded-lg bg-gray-50 p-6">
      <div class="mb-2 flex justify-between text-sm">
        <span>{{ t('cart.subtotal') }}</span>
        <span>NT.${{ cart.subtotal }}</span>
      </div>
      <div class="mb-2 flex justify-between text-sm">
        <span>{{ t('cart.discount') }}</span>
        <span>-NT.${{ cart.discount }}</span>
      </div>
      <div class="mb-4 flex justify-between text-sm">
        <span>{{ t('cart.shipping') }}</span>
        <span>NT.${{ cart.shippingFee }}</span>
      </div>
      <div class="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
        <span>{{ t('cart.total') }}</span>
        <span class="text-primary">NT.${{ cart.total }}</span>
      </div>
    </div>

    <!-- Buttons -->
    <div v-if="cart.items.length > 0" class="mb-12 flex gap-4">
      <RouterLink
        to="/shop"
        class="flex-1 rounded bg-black py-3 text-center text-white no-underline transition-colors hover:bg-primary"
      >
        {{ t('cart.continueShopping') }}
      </RouterLink>
      <RouterLink
        to="/checkout"
        class="flex-1 rounded bg-black py-3 text-center text-white no-underline transition-colors hover:bg-primary"
      >
        {{ t('cart.nextStep') }}
      </RouterLink>
    </div>
  </div>
</template>
