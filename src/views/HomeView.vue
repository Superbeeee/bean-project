<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/components/layout/AppFooter.vue'

const { t } = useI18n()

const containerRef = ref<HTMLElement | null>(null)
let isScrolling = false
let currentSection = 0

function onVideoMounted(el: any) {
  if (el instanceof HTMLVideoElement) {
    el.play().catch(() => {})
  }
}

function scrollToSection(index: number) {
  if (!containerRef.value || isScrolling) return
  // sections.length 個 hero + 1 個 footer，最大 index = sections.length
  const clamped = Math.max(0, Math.min(index, sections.length))
  if (clamped === currentSection) return

  isScrolling = true
  currentSection = clamped

  const target = containerRef.value.children[clamped] as HTMLElement
  if (!target) { isScrolling = false; return }

  // Smooth scroll with custom duration via JS animation
  const start = containerRef.value.scrollTop
  const end = target.offsetTop
  const duration = 1200 // ms, same as original fullpage.js config
  const startTime = performance.now()

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function animate(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutCubic(progress)

    containerRef.value!.scrollTop = start + (end - start) * eased

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // Lock out further scrolling for a moment after animation finishes
      setTimeout(() => { isScrolling = false }, 100)
    }
  }

  requestAnimationFrame(animate)
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  if (isScrolling) return

  if (e.deltaY > 0) {
    scrollToSection(currentSection + 1)
  } else if (e.deltaY < 0) {
    scrollToSection(currentSection - 1)
  }
}

// Touch support
let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  if (isScrolling) return
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      scrollToSection(currentSection + 1)
    } else {
      scrollToSection(currentSection - 1)
    }
  }
}

// Keyboard support
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault()
    scrollToSection(currentSection + 1)
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault()
    scrollToSection(currentSection - 1)
  }
}

// 在 mount 時存下實際掛載的元素，確保 unmount 時清除的是同一個元素。
// 不在 onUnmounted 重新讀 containerRef.value，因為 Vue 在 unmount
// 過程中可能已先將 template ref 設為 null，導致 listeners 無法被移除。
let mountedContainer: HTMLElement | null = null

onMounted(() => {
  mountedContainer = containerRef.value
  if (mountedContainer) {
    mountedContainer.addEventListener('wheel', onWheel, { passive: false })
    mountedContainer.addEventListener('touchstart', onTouchStart, { passive: true })
    mountedContainer.addEventListener('touchend', onTouchEnd, { passive: true })
  }
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  if (mountedContainer) {
    mountedContainer.removeEventListener('wheel', onWheel)
    mountedContainer.removeEventListener('touchstart', onTouchStart)
    mountedContainer.removeEventListener('touchend', onTouchEnd)
    mountedContainer = null
  }
  window.removeEventListener('keydown', onKeyDown)
  // 重置狀態，避免重新進入頁面時從上次離開的位置繼續
  currentSection = 0
  isScrolling = false
})

const sections = [
  {
    id: 'shop',
    to: '/shop',
    image: '/img/首頁1.png',
    title: 'BEANGO! Get a Taste!',
    buttonKey: 'home.shopButton',
    type: 'image' as const,
    position: 'center',
  },
  {
    id: 'art',
    to: '/art',
    video: '/video/sbs-intro.mp4',
    title: 'What is needed is a Bean Bang!',
    buttonKey: 'home.artButton',
    type: 'video' as const,
    position: 'center',
  },
  {
    id: 'menu',
    to: '/menu',
    image: '/img/首頁3.png',
    title: 'How about Plan Bean?',
    buttonKey: 'home.menuButton',
    type: 'image' as const,
    position: 'right',
  },
  {
    id: 'map',
    to: '/map',
    image: '/img/首頁4.png',
    title: 'Where have you bean?',
    buttonKey: 'home.mapButton',
    type: 'image' as const,
    position: 'center',
  },
]
</script>

<template>
  <div ref="containerRef" class="scroll-snap-container">
    <!-- Hero Sections -->
    <section
      v-for="section in sections"
      :key="section.id"
      class="scroll-snap-section relative w-full"
    >
      <!-- Background Image -->
      <img
        v-if="section.type === 'image'"
        :src="section.image"
        :alt="section.title"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <!-- Background Video -->
      <video
        v-if="section.type === 'video'"
        :ref="(el) => onVideoMounted(el)"
        class="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        autoplay
        playsinline
      >
        <source :src="section.video" type="video/mp4" />
      </video>

      <!-- Content Overlay -->
      <RouterLink
        :to="section.to"
        class="absolute inset-0 flex items-end justify-center pb-[20vh] no-underline"
      >
        <div
          class="w-[90%] text-center transition-all duration-1000"
          :class="section.position === 'right' ? 'lg:translate-x-[18%]' : ''"
        >
          <h2
            class="mb-5 font-serif text-2xl leading-tight tracking-wider text-white drop-shadow-[0.1em_0.1em_0.5em_black] lg:text-4xl"
          >
            {{ section.title }}
          </h2>
          <div
            class="btn-organic mx-auto inline-block cursor-pointer border-3 border-white px-4 py-2 text-sm tracking-wider text-white transition-all duration-500 hover:bg-primary lg:text-[26px]"
          >
            {{ t(section.buttonKey) }}
          </div>
        </div>
      </RouterLink>
    </section>

    <!-- Footer as last scroll-snap section -->
    <div class="scroll-snap-footer">
      <AppFooter />
    </div>
  </div>
</template>
