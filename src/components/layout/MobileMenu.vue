<script setup lang="ts">
defineProps<{
  open: boolean
  theme?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const navItems = [
  { to: '/shop', label: 'shop online|線上購買' },
  { to: '/art', label: 'bean Art Present|線上探索豆間' },
  { to: '/menu', label: 'bean Menu|豆間菜單' },
  { to: '/map', label: 'where? bean|尋找豆間' },
]
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 lg:hidden" :class="open ? '' : 'pointer-events-none'">
      <!-- Backdrop (instant appear, fade out) -->
      <Transition name="fade">
        <div v-if="open" class="absolute inset-0 bg-black/10" @click="emit('close')"></div>
      </Transition>

      <!-- Menu Content (slide from left) -->
      <Transition name="slide">
        <div v-if="open" class="relative z-10 h-full w-[70%] bg-white px-5 py-12">
          <!-- Logo -->
          <div class="mb-8">
            <RouterLink to="/" @click="emit('close')">
              <img src="/photo/b-logo/LOGO.png" alt="豆之間" class="w-[60px]" />
            </RouterLink>
          </div>

          <!-- Nav Links -->
          <ul class="space-y-9">
            <li v-for="item in navItems" :key="item.to">
              <RouterLink
                :to="item.to"
                class="block h-10 font-serif text-[13px] leading-10 tracking-wider text-black no-underline"
                @click="emit('close')"
              >
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>

          <!-- Social Links -->
          <ul class="mt-10 flex gap-2.5">
            <li>
              <a href="#" target="_blank">
                <img src="/photo/p-logo/p-fb.svg" alt="Facebook" class="w-[30px]" />
              </a>
            </li>
            <li>
              <a href="#" target="_blank">
                <img src="/photo/p-logo/p-ig.svg" alt="Instagram" class="w-[30px]" />
              </a>
            </li>
            <li>
              <RouterLink to="/inquiry" @click="emit('close')">
                <img src="/photo/p-logo/p-ask.svg" alt="洽詢" class="w-[30px]" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/cart" @click="emit('close')">
                <img src="/photo/p-logo/p-cart.svg" alt="購物車" class="w-[30px]" />
              </RouterLink>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </Teleport>

</template>

<style scoped>
/* Backdrop fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Menu panel slide from left */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
