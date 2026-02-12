<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
      <p class="intro-text-top mb-8 text-base leading-relaxed lg:text-lg">
        豆之間，早期傳統製作豆製品的場所，也就是台語的豆仔間。
      </p>
      <div class="intro-logo mx-auto mb-8 max-w-[300px]">
        <img src="/photo of ART/forartlogo.png" alt="豆之間 Logo" class="w-full" />
      </div>
      <p class="intro-text-bottom text-sm leading-relaxed text-gray-300 lg:text-base">
        | 池上豆之間 | 土地和農民之間的距離 | 農民和農會之間的關係 |
        <br />
        | 農會與消費者之間的關係 | 都是緊密的合作夥伴及超美好關係 |
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
          <h2 class="mb-4 text-4xl font-bold lg:text-6xl">穀倉的機遇</h2>
          <p class="text-xl text-primary lg:text-2xl">穀倉 <em>X</em> 視界</p>
        </div>
      </div>
    </div>

    <!-- Section 1: Content -->
    <section class="content-block mx-auto max-w-3xl px-4 py-20 text-center">
      <div class="section-body">
        <p class="mb-8 text-sm leading-relaxed text-gray-300">
          駐存池上米的寶庫<br />
          即是穀倉<br />
          建築也許會被時間摧殘<br />
          但農夫的勤奮光景<br />
          可以在新視界被留下
        </p>
      </div>

      <div class="section-divider mx-auto mb-8 h-px w-24 origin-center bg-primary/40"></div>

      <div class="section-body">
        <h3 class="mb-3 text-lg font-bold">場景介紹</h3>
        <p class="mb-8 text-sm leading-relaxed text-gray-300">
          豆之間是由池上農會將廢棄的穀倉改建而成，<br />
          這裏保留傳統木造穀倉意象，<br />
          注入大量採光，整個空間挑高而明亮，新穎中帶有一絲古早氣質。<br />
          屋頂留有從前巨大碾米機的部分構造，<br />
          建築、豆之間，融入了農舍老屋印記，<br />
          在時代快速演進下不忘過去的光陰，<br />
          是新的角度視界，亦是新的飲食穀倉。
        </p>
      </div>

      <div class="side-by-side flex flex-col items-center gap-6 lg:flex-row">
        <div class="side-img lg:w-1/3">
          <img src="/photo of ART/house.png" alt="池上" class="rounded-lg" />
        </div>
        <p class="side-text text-left text-sm leading-relaxed text-gray-300 lg:w-2/3">
          池上的田，總是穩穩地舖滿在巍然屹立的中央山脈腳下，
          一年之間，順應時序更換裝扮，時而澄澈如鏡、時而搖曳生姿、時而青綠鮮嫩、
          又時而艷黃如陽，年復一年，在農民勤作耕耘下，餵養著池上人。
          <br /><br />
          一方水土養一方人，自日治時期開始，池上以農為生，得天獨厚的自然環境，
          有著恰好日照、肥沃土壤，引來一群愛鄉愛土的樸實農人在此落地生根，
          池上之所以美，除了廣袤的視野，還有凝聚著共好的心意。
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
          <h2 class="mb-4 text-4xl font-bold lg:text-6xl">溯土 Revert to Earth</h2>
          <p class="text-xl text-primary lg:text-2xl">藝術 <em>X</em> 重現</p>
        </div>
      </div>
    </div>

    <!-- Section 2: Content -->
    <section class="content-block mx-auto max-w-3xl px-4 py-20 text-center">
      <div class="section-body">
        <p class="mb-2 text-sm leading-relaxed text-gray-300">
          因雨而濕潤的泥土香味緩緩升起，<br /><br />
          如同一首來自無聲庶民的讚歌。
        </p>
        <p class="mb-8 text-xs text-gray-500">泰戈爾《漂鳥集》 第310首</p>
      </div>

      <div class="section-divider mx-auto mb-8 h-px w-24 origin-center bg-primary/40"></div>

      <div class="section-body">
        <h3 class="mb-3 text-lg font-bold">作品理念</h3>
        <p class="mb-8 text-sm leading-relaxed text-gray-300">
          重拾阿美族古老的製陶技法，並嘗試從傳統延伸至當代創作的可能。<br />
          從挖土、曬乾、搗土、煉土到連夜不眠的野地野燒來製作陶片，透過身體力行向土地學習並保持連結。<br />
          作品以麻線來懸掛數百件陶片，創造一個多層次的圓形空間，<br />
          在木灰色的舊穀倉裡，像是一個時光隧道，更是一場人類對於土地無盡追溯的精神儀式。<br />
          圓形，有象徵和諧、融為一體、圓滿之意。
        </p>
      </div>

      <div class="side-by-side flex flex-col items-center gap-6 lg:flex-row">
        <div class="side-img lg:w-1/3">
          <img src="/photo of ART/artist.svg" alt="Artist" class="rounded-lg" />
        </div>
        <p class="side-text text-left text-sm leading-relaxed text-gray-300 lg:w-2/3">
          Aritst/海地·葉（Heidi Yip）<br />
          於1978年在香港出生，<br />
          畢業於多倫多安省藝術與設計學院之後，<br />
          自己到墨西哥、西藏、戈壁、紐約等地旅行尋找創作靈感，<br />
          最後到了台灣，<br />
          一個被太平洋包圍的小島，<br />
          激起她無限的創作熱情。
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
          <h2 class="mb-4 text-4xl font-bold lg:text-6xl">豆之間 | 豆仔間</h2>
          <p class="text-xl text-primary lg:text-2xl">時代 <em>X</em> 食現</p>
        </div>
      </div>
    </div>

    <!-- Section 3: Content -->
    <section class="content-block mx-auto max-w-3xl px-4 py-20 text-center">
      <div class="section-body">
        <p class="mb-8 text-sm leading-relaxed text-gray-300">
          豆仔間<br />
          早期傳統製作豆製品的場所<br /><br />
          豆之間<br />
          一個將光陰與藝術<br />
          一同實現的新食代
        </p>
      </div>

      <div class="section-divider mx-auto mb-8 h-px w-24 origin-center bg-primary/40"></div>

      <div class="section-body">
        <h3 class="mb-3 text-lg font-bold">結合機緣</h3>
        <p class="mb-8 text-sm leading-relaxed text-gray-300">
          池上豆之間有著老穀倉歷史歲月的痕跡，也有藝術家眼中的池上，<br />
          更有池上人對老穀倉懷念的味道，同時也看見老穀倉的新生。<br />
          關於池上豆之間成立的契機，池上栽種約20公頃的黃豆，照顧小農<br />
          解決銷售問題，支持本土國產雜糧，縮短食物哩程，<br />
          池上米很優、池上的黃豆很香、池上的蔬果很鮮甜，<br />
          池上的美好希望藉由【池上豆之間】 讓您看見不一樣的池上。
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
      <span class="text-xs">飛上去</span>
    </button>
  </div>
</template>
