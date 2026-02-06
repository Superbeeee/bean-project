<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import { useI18n } from 'vue-i18n'
import 'swiper/css'
import 'swiper/css/pagination'

const { t } = useI18n()

const swiperModules = [Autoplay, Pagination]

const menuSections = [
  {
    key: 'signature',
    slides: [
      '/photo of Carousel/show1/show1-1.png',
      '/photo of Carousel/show1/show1-2.png',
      '/photo of Carousel/show1/show1-3.png',
    ],
    items: [
      { key: 'a1', price: 'NT$60' },
      { key: 'a2', price: 'NT$60' },
      { key: 'a3', price: 'NT$80' },
      { key: 'a4', price: 'NT$60' },
      { key: 'a5', price: 'NT$80' },
      { key: 'a6', price: 'NT$80' },
    ],
  },
  {
    key: 'main',
    slides: [
      '/photo of Carousel/show2/show2-1.png',
      '/photo of Carousel/show2/show2-2.png',
      '/photo of Carousel/show2/show2-3.png',
    ],
    items: [
      { key: 'b1', price: 'NT$180' },
      { key: 'b2', price: 'NT$180' },
      { key: 'b3', price: 'NT$150' },
      { key: 'b4', price: 'NT$120' },
      { key: 'b5', price: 'NT$120' },
      { key: 'b6', price: 'NT$120' },
      { key: 'b7', price: 'NT$120' },
      { key: 'b8', price: 'NT$80' },
    ],
  },
  {
    key: 'set',
    slides: [
      '/photo of Carousel/show3/show3-1.png',
      '/photo of Carousel/show3/show3-2.png',
      '/photo of Carousel/show3/show3-3.png',
    ],
    items: [
      { key: 'c1', price: 'NT$290' },
      { key: 'c2', price: 'NT$290' },
      { key: 'c3', price: 'NT$290' },
      { key: 'c4', price: 'NT$390' },
      { key: 'c5', price: '' },
    ],
  },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="pt-[120px] lg:pt-[140px]">
    <!-- Title -->
    <div class="mb-8 text-center">
      <p class="text-2xl font-bold">{{ t('menu.pageTitle') }}</p>
    </div>

    <div class="mx-auto max-w-4xl px-4">
      <!-- Menu Sections -->
      <div v-for="section in menuSections" :key="section.key" class="mb-12">
        <h2 class="mb-6 text-center text-xl font-bold">{{ t(`menu.${section.key}.title`) }}</h2>

        <div class="flex flex-col gap-6 lg:flex-row">
          <!-- Swiper Carousel -->
          <div class="lg:w-1/2">
            <Swiper
              :modules="swiperModules"
              :slides-per-view="1"
              :autoplay="{ delay: 3000 }"
              :pagination="{ clickable: true }"
              class="rounded-lg"
            >
              <SwiperSlide v-for="(slide, i) in section.slides" :key="i">
                <img :src="slide" :alt="t(`menu.${section.key}.title`)" class="w-full rounded-lg object-cover" />
              </SwiperSlide>
            </Swiper>
          </div>

          <!-- Menu Items -->
          <div class="lg:w-1/2">
            <ul class="divide-y divide-gray-100">
              <li
                v-for="item in section.items"
                :key="item.key"
                class="flex items-center justify-between py-3"
              >
                <span class="text-sm lg:text-base">
                  {{ t(`menu.${section.key}.${item.key}`) }}
                </span>
                <span v-if="item.price" class="shrink-0 text-sm font-bold text-primary">
                  {{ item.price }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Top -->
    <button
      class="fixed bottom-8 right-8 z-30 flex flex-col items-center gap-1 rounded-full bg-white/80 p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
      @click="scrollToTop"
    >
      <img src="/photo/uparrow.png" alt="↑" class="w-5" />
      <span class="text-xs">{{ t('common.backToTop') }}</span>
    </button>
  </div>
</template>
