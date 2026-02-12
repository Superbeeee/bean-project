<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const pageRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

function initAnimations() {
  if (!pageRef.value) return

  ctx = gsap.context(() => {
    // ── Logo Intro: 縮放 + 淡入 ──
    const introTl = gsap.timeline()
    introTl
      .from('.intro-logo', { scale: 0.5, opacity: 0, duration: 1.5, ease: 'power3.out' })
      .from('.intro-text-top', { y: 40, opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
      .from('.intro-text-bottom', { y: 30, opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.6')

    // ── Hero 大圖: 釘選 + 電影級縮放 ──
    gsap.utils.toArray<HTMLElement>('.hero-panel').forEach((panel) => {
      const img = panel.querySelector('.hero-img')
      const caption = panel.querySelector('.hero-caption')
      const overlay = panel.querySelector('.hero-overlay')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.8,
        },
      })

      // 圖片從 1.3 縮放到 1，產生電影鏡頭拉遠的感覺
      tl.fromTo(img, { scale: 1.3 }, { scale: 1, ease: 'none' }, 0)
      // 暗色遮罩淡入
      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.2)
      // 標題文字從下方飛入
      tl.fromTo(
        caption,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.3,
      )
    })

    // ── 內容區: clipPath 揭幕效果 ──
    gsap.utils.toArray<HTMLElement>('.content-block').forEach((block) => {
      gsap.fromTo(
        block,
        { clipPath: 'inset(8% 0 0 0)', y: 60, opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    // ── 段落文字: 淡入上浮 ──
    gsap.utils.toArray<HTMLElement>('.section-body').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    })

    // ── 分隔線: 從中心展開 ──
    gsap.utils.toArray<HTMLElement>('.section-divider').forEach((line) => {
      gsap.from(line, {
        scaleX: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: line,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    })

    // ── 圖文並排: 左圖旋轉滑入 + 右文滑入 ──
    gsap.utils.toArray<HTMLElement>('.side-by-side').forEach((row) => {
      const img = row.querySelector('.side-img')
      const text = row.querySelector('.side-text')

      if (img) {
        gsap.from(img, {
          opacity: 0,
          x: -80,
          rotation: -3,
          duration: 1.4,
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
          x: 80,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    // ── 水平捲動圖片展 ──
    const galleryTrack = pageRef.value!.querySelector('.gallery-track') as HTMLElement
    if (galleryTrack) {
      const galleryItems = galleryTrack.querySelectorAll('.gallery-slide')
      // 總移動距離 = (項目數 - 1) * 每項寬度(含 gap)
      const scrollAmount = galleryTrack.scrollWidth - window.innerWidth

      gsap.to(galleryTrack, {
        x: -scrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gallery-section',
          start: 'top top',
          end: `+=${scrollAmount}`,
          pin: true,
          scrub: 0.6,
        },
      })

      // 每張圖片在進入時有微旋轉 + 縮放效果
      galleryItems.forEach((item, i) => {
        gsap.from(item, {
          scale: 0.8,
          opacity: 0,
          rotation: i % 2 === 0 ? -5 : 5,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            containerAnimation: gsap.getById?.('galleryScroll') || undefined,
            start: 'left 80%',
            toggleActions: 'play none none none',
          },
        })
      })
    }

    // ── 結尾大圖: 從遠處飛來 + 淡入 ──
    gsap.fromTo(
      '.final-img',
      { scale: 0.7, opacity: 0, y: 60 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: 'power3.out',
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
})

onUnmounted(() => {
  ctx?.revert()
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div ref="pageRef" class="overflow-x-hidden bg-dark text-white">
    <!-- ====== Logo Intro ====== -->
    <section class="mx-auto max-w-6xl px-4 pb-20 pt-[140px] text-center">
      <p class="intro-text-top mb-8 whitespace-pre-line text-base leading-relaxed lg:text-lg">
        {{ t('art.intro') }}
      </p>
      <div class="intro-logo mx-auto mb-8 max-w-[300px]">
        <img src="/photo of ART/forartlogo.png" alt="豆之間 Logo" class="w-full" />
      </div>
      <p class="intro-text-bottom whitespace-pre-line text-sm leading-relaxed text-gray-300 lg:text-base">
        {{ t('art.subtitle') }}
      </p>
    </section>

    <!-- ====== Section 1: 穀倉的機遇 — Hero Pin ====== -->
    <div class="hero-panel relative h-screen overflow-hidden">
      <img
        src="/photo of ART/structure.JPG"
        alt="穀倉"
        class="hero-img absolute inset-0 h-full w-full object-cover"
      />
      <div class="hero-overlay absolute inset-0 bg-black/50"></div>
      <div class="hero-caption absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <h2 class="mb-4 text-4xl font-bold lg:text-6xl">{{ t('art.granary.title') }}</h2>
          <p class="text-xl text-primary lg:text-2xl">{{ t('art.granary.subtitle') }}</p>
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
        <h3 class="mb-3 text-lg font-bold">{{ t('art.granary.sceneTitle') }}</h3>
        <p class="mb-8 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.granary.scene') }}
        </p>
      </div>

      <div class="side-by-side flex flex-col items-center gap-6 lg:flex-row">
        <div class="side-img lg:w-1/3">
          <img src="/photo of ART/house.png" alt="池上" class="rounded-lg" />
        </div>
        <p class="side-text whitespace-pre-line text-left text-sm leading-relaxed text-gray-300 lg:w-2/3">
          {{ t('art.granary.history') }}
        </p>
      </div>
    </section>

    <!-- ====== Section 2: 溯土 — Hero Pin ====== -->
    <div class="hero-panel relative h-screen overflow-hidden">
      <img
        src="/photo of ART/the-art.jpg"
        alt="溯土"
        class="hero-img absolute inset-0 h-full w-full object-cover"
      />
      <div class="hero-overlay absolute inset-0 bg-black/50"></div>
      <div class="hero-caption absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <h2 class="mb-4 text-4xl font-bold lg:text-6xl">{{ t('art.revert.title') }}</h2>
          <p class="text-xl text-primary lg:text-2xl">{{ t('art.revert.subtitle') }}</p>
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
        <h3 class="mb-3 text-lg font-bold">{{ t('art.revert.conceptTitle') }}</h3>
        <p class="mb-8 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.revert.concept') }}
        </p>
      </div>

      <div class="side-by-side flex flex-col items-center gap-6 lg:flex-row">
        <div class="side-img lg:w-1/3">
          <img src="/photo of ART/artist.svg" alt="Artist" class="rounded-lg" />
        </div>
        <p class="side-text whitespace-pre-line text-left text-sm leading-relaxed text-gray-300 lg:w-2/3">
          {{ t('art.revert.artist') }}
        </p>
      </div>
    </section>

    <!-- ====== Section 3: 豆之間 — Hero Pin ====== -->
    <div class="hero-panel relative h-screen overflow-hidden">
      <img
        src="/photo of ART/combine.png"
        alt="豆之間"
        class="hero-img absolute inset-0 h-full w-full object-cover"
      />
      <div class="hero-overlay absolute inset-0 bg-black/50"></div>
      <div class="hero-caption absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <h2 class="mb-4 text-4xl font-bold lg:text-6xl">{{ t('art.bean.title') }}</h2>
          <p class="text-xl text-primary lg:text-2xl">{{ t('art.bean.subtitle') }}</p>
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
        <h3 class="mb-3 text-lg font-bold">{{ t('art.bean.comboTitle') }}</h3>
        <p class="mb-8 whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {{ t('art.bean.combo') }}
        </p>
      </div>
    </section>

    <!-- ====== 水平捲動圖片展 ====== -->
    <div class="gallery-section overflow-hidden">
      <div class="gallery-track flex">
        <div
          class="gallery-slide flex h-screen w-screen flex-none items-center justify-center p-8"
        >
          <img
            src="/photo of ART/show1.png"
            alt=""
            class="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
        <div
          class="gallery-slide flex h-screen w-screen flex-none items-center justify-center p-8"
        >
          <img
            src="/photo of ART/show2.png"
            alt=""
            class="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
        <div
          class="gallery-slide flex h-screen w-screen flex-none items-center justify-center p-8"
        >
          <img
            src="/photo of ART/show3.png"
            alt=""
            class="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      </div>
    </div>

    <!-- ====== Final Image ====== -->
    <section class="mx-auto max-w-3xl px-4 py-20">
      <div class="final-img overflow-hidden rounded-lg">
        <img src="/photo of ART/final.png" alt="" class="w-full object-cover" />
      </div>
    </section>

    <!-- Back to Top -->
    <button
      class="fixed bottom-8 right-8 z-30 flex flex-col items-center gap-1 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/40"
      @click="scrollToTop"
    >
      <img src="/photo/uparrow.png" alt="上" class="w-5" />
      <span class="text-xs">{{ t('common.backToTop') }}</span>
    </button>
  </div>
</template>
