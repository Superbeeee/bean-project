<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isHome = computed(() => route.name === 'home')
</script>

<template>
  <!-- Homepage: fullscreen scroll-snap, no footer wrapping -->
  <template v-if="isHome">
    <AppHeader :theme="(route.meta.headerTheme as string) ?? 'dark'" />
    <RouterView />
  </template>

  <!-- Other pages: normal layout with header + footer -->
  <div v-else class="flex min-h-screen flex-col">
    <AppHeader :theme="(route.meta.headerTheme as string) ?? 'dark'" />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
