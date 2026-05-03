<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const pageRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

// ── 將元素文字逐字拆分為 <span>（供 stagger 動畫使用）──
function splitIntoChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent || ''
  el.textContent = ''
  const spans: HTMLElement[] = []
  for (const ch of text) {
    const span = document.createElement('span')
    span.className = 'split-char'
    span.style.cssText = 'display:inline-block;white-space:pre'
    span.textContent = ch
    el.appendChild(span)
    spans.push(span)
  }
  return spans
}

// ── 自訂游標追蹤（使用 GSAP quickTo 達到絲滑跟隨效果）──
let cursorMoveHandler: ((e: MouseEvent) => void) | null = null
const cursorHoverTargets: Array<[HTMLElement, EventListener, EventListener]> = []

function initAnimations() {
  if (!pageRef.value) return

  ctx = gsap.context(() => {
    // ── 捲動進度條 ──
    gsap.to('.scroll-progress-bar', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: pageRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0,
      },
    })

    // ── Logo Intro：彈跳旋轉 + 模糊淡入 ──
    gsap.timeline()
      .from('.intro-logo', {
        scale: 0.3,
        opacity: 0,
        rotation: -15,
        duration: 1.8,
        ease: 'elastic.out(1, 0.5)',
      })
      .from(
        '.intro-text-top',
        { y: 50, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'power3.out' },
        '-=1.0',
      )
      .from(
        '.intro-text-bottom',
        { y: 30, opacity: 0, filter: 'blur(6px)', duration: 1.0, ease: 'power2.out' },
        '-=0.7',
      )

    // ── Hero 大圖：釘選 + Ken Burns + 色調漸變 + 章節數字視差 ──
    gsap.utils.toArray<HTMLElement>('.hero-panel').forEach((panel) => {
      const img = panel.querySelector<HTMLElement>('.hero-img')
      const caption = panel.querySelector('.hero-caption')
      const overlay = panel.querySelector('.hero-overlay')
      const numEl = panel.querySelector<HTMLElement>('.hero-num')
      const titleEl = panel.querySelector<HTMLElement>('.hero-title')
      const subtitleEl = panel.querySelector<HTMLElement>('.hero-subtitle')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.8,
        },
      })

      // 圖片：Ken Burns — 縮放 + 水平漂移 + 由暗轉亮
      tl.fromTo(
        img,
        { scale: 1.4, x: 40, filter: 'brightness(0.45) saturate(0.6)' },
        { scale: 1, x: 0, filter: 'brightness(1) saturate(1)', ease: 'none' },
        0,
      )
      // 遮罩漸顯
      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.1)
      // 標題組飛入
      tl.fromTo(caption, { y: 100, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out' }, 0.25)
      // 章節數字：反向視差（製造景深感）
      if (numEl) {
        tl.fromTo(numEl, { y: 80 }, { y: -80, ease: 'none' }, 0)
      }

      // 標題文字：逐字滑入（進入 65% 視窗時觸發，非 scrub）
      if (titleEl) {
        const chars = splitIntoChars(titleEl)
        gsap.from(chars, {
          opacity: 0,
          y: 50,
          stagger: 0.04,
          duration: 0.7,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: panel,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
        })
      }

      // 副標題：字距由寬壓縮至正常
      if (subtitleEl) {
        gsap.from(subtitleEl, {
          opacity: 0,
          letterSpacing: '0.6em',
          duration: 1.5,
          ease: 'power3.out',
          delay: 0.6,
          scrollTrigger: {
            trigger: panel,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    // ── 內容區：3D 透視翻轉揭幕 ──
    gsap.utils.toArray<HTMLElement>('.content-block').forEach((block) => {
      gsap.fromTo(
        block,
        {
          clipPath: 'inset(10% 0 0 0)',
          y: 80,
          opacity: 0,
          rotateX: 6,
          transformPerspective: 1000,
        },
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    // ── 段落標題：逐字展開 ──
    gsap.utils.toArray<HTMLElement>('.section-heading').forEach((heading) => {
      const chars = splitIntoChars(heading)
      gsap.from(chars, {
        opacity: 0,
        y: 30,
        stagger: 0.04,
        duration: 0.6,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    })

    // ── 段落文字：模糊淡入上浮 ──
    gsap.utils.toArray<HTMLElement>('.section-body').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        filter: 'blur(5px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    })

    // ── 分隔線：從中心展開 + 粉色光暈脈衝 ──
    gsap.utils.toArray<HTMLElement>('.section-divider').forEach((line) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: line,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
        .from(line, { scaleX: 0, duration: 1.2, ease: 'power2.inOut' })
        .to(line, {
          boxShadow: '0 0 18px 8px rgba(217,173,160,0.8)',
          duration: 0.5,
          ease: 'power2.out',
        })
        .to(line, {
          boxShadow: '0 0 0 0 rgba(217,173,160,0)',
          duration: 1.0,
          ease: 'power2.in',
        })
    })

    // ── 圖文並排：左圖旋轉模糊滑入 + 右文滑入 ──
    gsap.utils.toArray<HTMLElement>('.side-by-side').forEach((row) => {
      const img = row.querySelector('.side-img')
      const text = row.querySelector('.side-text')
      if (img) {
        gsap.from(img, {
          opacity: 0,
          x: -100,
          rotation: -5,
          scale: 0.9,
          filter: 'blur(8px)',
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
      if (text) {
        gsap.from(text, {
          opacity: 0,
          x: 100,
          filter: 'blur(5px)',
          duration: 1.5,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    // ── 水平捲動圖片展：滾動帶動 + 進度計數器即時更新 ──
    const galleryTrack = pageRef.value!.querySelector('.gallery-track') as HTMLElement
    if (galleryTrack) {
      const scrollAmount = galleryTrack.scrollWidth - window.innerWidth

      ScrollTrigger.create({
        trigger: '.gallery-section',
        start: 'top top',
        end: `+=${scrollAmount}`,
        pin: true,
        scrub: 0.6,
        animation: gsap.to(galleryTrack, { x: -scrollAmount, ease: 'none' }),
      })

      // 所有圖片在畫廊進入視窗時交錯出現
      gsap.from('.gallery-slide img', {
        scale: 0.75,
        opacity: 0,
        rotation: (i: number) => (i % 2 === 0 ? -8 : 8),
        filter: 'blur(10px)',
        duration: 1.2,
        stagger: 0.25,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.gallery-section',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })
    }

    // ── 結尾大圖：模糊消散 + 彈跳縮放 ──
    gsap.fromTo(
      '.final-img',
      { scale: 0.6, opacity: 0, y: 80, filter: 'blur(14px)' },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 2.0,
        ease: 'elastic.out(1, 0.6)',
        scrollTrigger: {
          trigger: '.final-img',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      },
    )
  }, pageRef.value)
}

onMounted(async () => {
  await nextTick()

  const images = pageRef.value?.querySelectorAll('img') ?? []
  const promises = Array.from(images).map(
    (img) =>
      new Promise<void>((resolve) => {
        if (img.complete) return resolve()
        img.onload = () => resolve()
        img.onerror = () => resolve()
      }),
  )
  await Promise.all(promises)

  initAnimations()
  ScrollTrigger.refresh()

  // ── 自訂游標：僅在有精細指標裝置（滑鼠）時啟用 ──
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursorEl = document.querySelector<HTMLElement>('.cursor-orb')
    if (cursorEl) {
      // quickTo 讓游標跟隨更絲滑，帶有輕微延遲感
      const xTo = gsap.quickTo(cursorEl, 'x', { duration: 0.35, ease: 'power3' })
      const yTo = gsap.quickTo(cursorEl, 'y', { duration: 0.35, ease: 'power3' })

      cursorMoveHandler = (e: MouseEvent) => {
        xTo(e.clientX - 25) // 25 = 游標寬度一半，使光暈居中
        yTo(e.clientY - 25)
      }
      document.addEventListener('mousemove', cursorMoveHandler)

      // 滑過圖片或按鈕時游標放大
      pageRef.value?.querySelectorAll<HTMLElement>('img, button, a').forEach((el) => {
        const onEnter = () =>
          gsap.to(cursorEl, { scale: 2.8, opacity: 0.8, duration: 0.3, ease: 'power2.out' })
        const onLeave = () =>
          gsap.to(cursorEl, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' })
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        cursorHoverTargets.push([el, onEnter as EventListener, onLeave as EventListener])
      })

      // 隱藏系統游標
      document.body.classList.add('art-cursor-active')
    }
  }
})

onUnmounted(() => {
  ctx?.revert()

  if (cursorMoveHandler) {
    document.removeEventListener('mousemove', cursorMoveHandler)
    cursorMoveHandler = null
  }
  cursorHoverTargets.forEach(([el, enter, leave]) => {
    el.removeEventListener('mouseenter', enter)
    el.removeEventListener('mouseleave', leave)
  })
  cursorHoverTargets.length = 0
  document.body.classList.remove('art-cursor-active')
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div ref="pageRef" class="overflow-x-hidden bg-dark text-white">
    <!-- 自訂游標光暈 -->
    <div class="cursor-orb pointer-events-none fixed z-500 rounded-full"></div>

    <!-- 捲動進度條 -->
    <div class="scroll-progress-bar fixed left-0 top-0 z-300 h-0.75 w-0"></div>

    <!-- 底片顆粒感覆蓋層 -->
    <div class="grain-overlay pointer-events-none fixed inset-0 z-200"></div>

    <!-- ====== Logo Intro ====== -->
    <section class="mx-auto max-w-6xl px-4 pb-20 pt-35 text-center">
      <p class="intro-text-top mb-8 whitespace-pre-line text-base leading-relaxed lg:text-lg">
        {{ t('art.intro') }}
      </p>
      <div class="intro-logo mx-auto mb-8 max-w-75">
        <img :src="$asset('/photo of ART/forartlogo.png')" alt="豆之間 Logo" class="w-full" />
      </div>
      <p class="intro-text-bottom whitespace-pre-line text-sm leading-relaxed text-gray-300 lg:text-base">
        {{ t('art.subtitle') }}
      </p>
    </section>

    <!-- ====== Section 1: 穀倉的機遇 — Hero Pin ====== -->
    <div class="hero-panel relative h-screen overflow-hidden">
      <img
        :src="$asset('/photo of ART/structure.JPG')"
        alt="穀倉"
        class="hero-img absolute inset-0 h-full w-full object-cover"
      />
      <div class="hero-overlay absolute inset-0 bg-black/50"></div>
      <!-- 大背景數字：視差反向漂移 -->
      <div class="hero-num pointer-events-none absolute -bottom-4 right-4 z-5 select-none font-serif text-[28vw] font-black leading-none text-white opacity-[0.04]">
        01
      </div>
      <div class="hero-caption absolute inset-0 z-10 flex items-center justify-center">
        <div class="text-center">
          <h2 class="hero-title mb-4 text-4xl font-bold lg:text-6xl">{{ t('art.granary.title') }}</h2>
          <p class="hero-subtitle text-xl text-primary lg:text-2xl">{{ t('art.granary.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Section 1: Content -->
    <section class="content-block mx-auto max-w-3xl px-4 py-20 text-center">
      <div class="section-body">
        <p class="mb-8 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.granary.poem') }}
        </p>
      </div>

      <div class="section-divider mx-auto mb-8 h-px w-24 origin-center bg-primary/40"></div>

      <div class="section-body">
        <h3 class="section-heading mb-3 text-lg font-bold">{{ t('art.granary.sceneTitle') }}</h3>
        <p class="mb-8 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.granary.scene') }}
        </p>
      </div>

      <div class="side-by-side flex flex-col items-center gap-6 lg:flex-row">
        <div class="side-img lg:w-1/3">
          <img :src="$asset('/photo of ART/house.png')" alt="池上" class="rounded-lg" />
        </div>
        <p class="side-text whitespace-pre-line text-left text-sm leading-relaxed text-gray-300 lg:w-2/3">
          {{ t('art.granary.history') }}
        </p>
      </div>
    </section>

    <!-- ====== Section 2: 溯土 — Hero Pin ====== -->
    <div class="hero-panel relative h-screen overflow-hidden">
      <img
        :src="$asset('/photo of ART/the-art.jpg')"
        alt="溯土"
        class="hero-img absolute inset-0 h-full w-full object-cover"
      />
      <div class="hero-overlay absolute inset-0 bg-black/50"></div>
      <div class="hero-num pointer-events-none absolute -bottom-4 right-4 z-5 select-none font-serif text-[28vw] font-black leading-none text-white opacity-[0.04]">
        02
      </div>
      <div class="hero-caption absolute inset-0 z-10 flex items-center justify-center">
        <div class="text-center">
          <h2 class="hero-title mb-4 text-4xl font-bold lg:text-6xl">{{ t('art.revert.title') }}</h2>
          <p class="hero-subtitle text-xl text-primary lg:text-2xl">{{ t('art.revert.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Section 2: Content -->
    <section class="content-block mx-auto max-w-3xl px-4 py-20 text-center">
      <div class="section-body">
        <p class="mb-2 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.revert.poem') }}
        </p>
        <p class="mb-8 text-xs text-gray-500">{{ t('art.revert.poemSource') }}</p>
      </div>

      <div class="section-divider mx-auto mb-8 h-px w-24 origin-center bg-primary/40"></div>

      <div class="section-body">
        <h3 class="section-heading mb-3 text-lg font-bold">{{ t('art.revert.conceptTitle') }}</h3>
        <p class="mb-8 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.revert.concept') }}
        </p>
      </div>

      <div class="side-by-side flex flex-col items-center gap-6 lg:flex-row">
        <div class="side-img lg:w-1/3">
          <img :src="$asset('/photo of ART/artist.svg')" alt="Artist" class="rounded-lg" />
        </div>
        <p class="side-text whitespace-pre-line text-left text-sm leading-relaxed text-gray-300 lg:w-2/3">
          {{ t('art.revert.artist') }}
        </p>
      </div>
    </section>

    <!-- ====== Section 3: 豆之間 — Hero Pin ====== -->
    <div class="hero-panel relative h-screen overflow-hidden">
      <img
        :src="$asset('/photo of ART/combine.png')"
        alt="豆之間"
        class="hero-img absolute inset-0 h-full w-full object-cover"
      />
      <div class="hero-overlay absolute inset-0 bg-black/50"></div>
      <div class="hero-num pointer-events-none absolute -bottom-4 right-4 z-5 select-none font-serif text-[28vw] font-black leading-none text-white opacity-[0.04]">
        03
      </div>
      <div class="hero-caption absolute inset-0 z-10 flex items-center justify-center">
        <div class="text-center">
          <h2 class="hero-title mb-4 text-4xl font-bold lg:text-6xl">{{ t('art.bean.title') }}</h2>
          <p class="hero-subtitle text-xl text-primary lg:text-2xl">{{ t('art.bean.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Section 3: Content -->
    <section class="content-block mx-auto max-w-3xl px-4 py-20 text-center">
      <div class="section-body">
        <p class="mb-8 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.bean.poem') }}
        </p>
      </div>

      <div class="section-divider mx-auto mb-8 h-px w-24 origin-center bg-primary/40"></div>

      <div class="section-body">
        <h3 class="section-heading mb-3 text-lg font-bold">{{ t('art.bean.comboTitle') }}</h3>
        <p class="mb-8 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.bean.combo') }}
        </p>
      </div>
    </section>

    <!-- ====== 水平捲動圖片展 ====== -->
    <div class="gallery-section relative overflow-hidden">
      <div class="gallery-track flex">
        <div
          class="gallery-slide flex h-screen w-screen flex-none items-center justify-center p-8"
        >
          <img
            :src="$asset('/photo of ART/show1.png')"
            alt=""
            class="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
        <div
          class="gallery-slide flex h-screen w-screen flex-none items-center justify-center p-8"
        >
          <img
            :src="$asset('/photo of ART/show2.png')"
            alt=""
            class="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
        <div
          class="gallery-slide flex h-screen w-screen flex-none items-center justify-center p-8"
        >
          <img
            :src="$asset('/photo of ART/show3.png')"
            alt=""
            class="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      </div>
    </div>

    <!-- ====== Final Image ====== -->
    <section class="mx-auto max-w-3xl px-4 py-20">
      <div class="final-img overflow-hidden rounded-lg">
        <img :src="$asset('/photo of ART/final.png')" alt="" class="w-full object-cover" />
      </div>
    </section>

    <!-- Back to Top -->
    <button
      class="fixed bottom-8 right-8 z-30 flex flex-col items-center gap-1 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/40"
      @click="scrollToTop"
    >
      <img :src="$asset('/photo/uparrow.png')" alt="上" class="w-5" />
      <span class="text-xs">{{ t('common.backToTop') }}</span>
    </button>
  </div>
</template>

<!-- 全域：ArtView 啟用自訂游標時隱藏系統游標 -->
<style>
.art-cursor-active,
.art-cursor-active * {
  cursor: none !important;
}
</style>

<style scoped>
/* 自訂游標光暈：初始定位在螢幕外，mousemove 後由 GSAP 接管 x/y */
.cursor-orb {
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, rgba(217, 173, 160, 0.7) 0%, rgba(217, 173, 160, 0.15) 55%, transparent 75%);
  filter: blur(4px);
  transform: translate(-9999px, -9999px); /* 初始隱藏 */
}

/* 捲動進度條漸層 */
.scroll-progress-bar {
  background: linear-gradient(90deg, #d9ada0 0%, rgba(255, 255, 255, 0.85) 100%);
}

/* 底片顆粒感材質 */
.grain-overlay {
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px;
  animation: grain-shift 0.4s steps(1) infinite;
}

@keyframes grain-shift {
  0%   { transform: translate(0, 0); }
  10%  { transform: translate(-3%, -2%); }
  20%  { transform: translate(4%, 3%); }
  30%  { transform: translate(-2%, 5%); }
  40%  { transform: translate(5%, -3%); }
  50%  { transform: translate(-4%, 2%); }
  60%  { transform: translate(3%, 4%); }
  70%  { transform: translate(-5%, -1%); }
  80%  { transform: translate(2%, -4%); }
  90%  { transform: translate(-1%, 3%); }
  100% { transform: translate(0, 0); }
}
</style>
