<script setup lang="ts">
import { ref } from 'vue'
import MobileMenu from './MobileMenu.vue'

const props = withDefaults(defineProps<{ theme?: string }>(), {
  theme: 'dark',
})

const mobileMenuOpen = ref(false)

function toggleMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <!-- Desktop Header -->
  <header
    class="fixed top-0 z-40 flex w-full items-center justify-center transition-all duration-300"
    :class="theme === 'white' ? '' : ''"
  >
    <div class="flex w-full max-w-7xl items-center justify-between px-5 lg:justify-center lg:gap-8">
      <!-- Logo -->
      <RouterLink to="/" class="mt-4 shrink-0 pr-4 lg:mt-[30px] lg:pr-[50px]">
        <img
          :src="theme === 'white' ? '/photo/w-logo/W-LOGO.png' : '/photo/b-logo/LOGO.png'"
          alt="豆之間"
          class="w-[80px] lg:w-[95px]"
        />
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="hidden lg:block">
        <div class="flex gap-4 py-[41px] font-serif text-[15px] leading-relaxed">
          <RouterLink
            to="/shop"
            class="nav-link-hover overflow-hidden h-5 mx-[15px]"
            :class="theme === 'white' ? 'text-white' : 'text-black'"
          >
            <span data-hover="線上購買">shop online</span>
          </RouterLink>
          <RouterLink
            to="/art"
            class="nav-link-hover overflow-hidden h-5 mx-[15px]"
            :class="theme === 'white' ? 'text-white' : 'text-black'"
          >
            <span data-hover="線上探索豆間">bean Art Present</span>
          </RouterLink>
          <RouterLink
            to="/menu"
            class="nav-link-hover overflow-hidden h-5 mx-[15px]"
            :class="theme === 'white' ? 'text-white' : 'text-black'"
          >
            <span data-hover="豆間菜單">bean Menu</span>
          </RouterLink>
          <RouterLink
            to="/map"
            class="nav-link-hover overflow-hidden h-5 mx-[15px]"
            :class="theme === 'white' ? 'text-white' : 'text-black'"
          >
            <span data-hover="尋找豆間">where? bean</span>
          </RouterLink>
        </div>
      </nav>

      <!-- Desktop Social Links -->
      <ul class="hidden lg:inline-flex lg:gap-2.5 lg:pt-[50px]">
        <li>
          <a href="#" target="_blank">
            <img
              :src="theme === 'white' ? '/photo/w-logo/w-fb.svg' : '/photo/b-logo/b-fb.svg'"
              alt="Facebook"
              class="h-[30px] w-[30px] transition-transform duration-300 hover:scale-150"
            />
          </a>
        </li>
        <li>
          <a href="#" target="_blank">
            <img
              :src="theme === 'white' ? '/photo/w-logo/w-ig.svg' : '/photo/b-logo/b-ig.svg'"
              alt="Instagram"
              class="h-[30px] w-[30px] transition-transform duration-300 hover:scale-150"
            />
          </a>
        </li>
        <li>
          <RouterLink to="/inquiry">
            <img
              :src="theme === 'white' ? '/photo/w-logo/w-ask-logo.png' : '/photo/b-logo/b-ask.png'"
              alt="洽詢"
              class="h-[30px] w-[30px] transition-transform duration-300 hover:scale-150"
            />
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/cart">
            <img
              :src="theme === 'white' ? '/photo/w-logo/w-cart.svg' : '/photo/b-logo/b-cart.svg'"
              alt="購物車"
              class="h-[30px] w-[30px] transition-transform duration-300 hover:scale-150"
            />
          </RouterLink>
        </li>
      </ul>

      <!-- Mobile Hamburger -->
      <div class="hamburger-wrap block lg:hidden" :class="{ 'is-open': mobileMenuOpen }">
        <input
          id="menu_checkbox"
          type="checkbox"
          class="hidden"
          :checked="mobileMenuOpen"
          @change="toggleMenu"
        />
        <label
          for="menu_checkbox"
          class="hamburger-label"
          :class="theme === 'white' ? 'hamburger-white' : 'hamburger-dark'"
        >
          <div class="hamburger-bar"></div>
        </label>
      </div>
    </div>
  </header>

  <!-- Mobile Menu -->
  <MobileMenu :open="mobileMenuOpen" :theme="theme" @close="mobileMenuOpen = false" />
</template>
