<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="bg-dark text-white">
    <!-- Main Content -->
    <section class="mx-auto max-w-6xl px-4 pt-[140px]">
      <!-- Logo Introduction -->
      <div class="mb-20 text-center transition-all duration-[3000ms]" :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'">
        <p class="mb-8 text-base leading-relaxed lg:text-lg">
          豆之間，早期傳統製作豆製品的場所，也就是台語的豆仔間。
        </p>
        <div class="mx-auto mb-8 max-w-[300px]">
          <img src="/photo of ART/forartlogo.png" alt="豆之間 Logo" class="w-full" />
        </div>
        <p class="text-sm leading-relaxed text-gray-300 lg:text-base">
          | 池上豆之間 | 土地和農民之間的距離 | 農民和農會之間的關係 |
          <br />
          | 農會與消費者之間的關係 | 都是緊密的合作夥伴及超美好關係 |
        </p>
      </div>

      <!-- Section 1: 穀倉的機遇 -->
      <section class="mb-20">
        <div class="mb-10 overflow-hidden rounded-lg">
          <img src="/photo of ART/structure.JPG" alt="穀倉" class="w-full object-cover" />
        </div>

        <div class="mx-auto max-w-3xl text-center">
          <h2 class="mb-4 text-2xl font-bold lg:text-3xl">池上農會穀倉的機遇</h2>
          <p class="mb-4 text-lg text-primary">
            穀倉 <em>X</em> 視界
          </p>
          <p class="mb-8 text-sm leading-relaxed text-gray-300">
            駐存池上米的寶庫<br />
            即是穀倉<br />
            建築也許會被時間摧殘<br />
            但農夫的勤奮光景<br />
            可以在新視界被留下
          </p>

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

          <div class="flex flex-col items-center gap-6 lg:flex-row">
            <div class="lg:w-1/3">
              <img src="/photo of ART/house.png" alt="池上" class="rounded-lg" />
            </div>
            <p class="text-left text-sm leading-relaxed text-gray-300 lg:w-2/3">
              池上的田，總是穩穩地舖滿在巍然屹立的中央山脈腳下，
              一年之間，順應時序更換裝扮，時而澄澈如鏡、時而搖曳生姿、時而青綠鮮嫩、
              又時而艷黃如陽，年復一年，在農民勤作耕耘下，餵養著池上人。
              <br /><br />
              一方水土養一方人，自日治時期開始，池上以農為生，得天獨厚的自然環境，
              有著恰好日照、肥沃土壤，引來一群愛鄉愛土的樸實農人在此落地生根，
              池上之所以美，除了廣袤的視野，還有凝聚著共好的心意。
            </p>
          </div>
        </div>
      </section>

      <!-- Section 2: 溯土 Revert to Earth -->
      <section class="mb-20">
        <div class="mb-10 overflow-hidden rounded-lg">
          <img src="/photo of ART/the-art.jpg" alt="溯土" class="w-full object-cover" />
        </div>

        <div class="mx-auto max-w-3xl text-center">
          <h2 class="mb-4 text-2xl font-bold lg:text-3xl">《 溯土Revert to Earth 》</h2>
          <p class="mb-4 text-lg text-primary">
            藝術 <em>X</em> 重現
          </p>
          <p class="mb-2 text-sm leading-relaxed text-gray-300">
            因雨而濕潤的泥土香味緩緩升起，<br /><br />
            如同一首來自無聲庶民的讚歌。
          </p>
          <p class="mb-8 text-xs text-gray-500">泰戈爾《漂鳥集》 第310首</p>

          <h3 class="mb-3 text-lg font-bold">作品理念</h3>
          <p class="mb-8 text-sm leading-relaxed text-gray-300">
            重拾阿美族古老的製陶技法，並嘗試從傳統延伸至當代創作的可能。<br />
            從挖土、曬乾、搗土、煉土到連夜不眠的野地野燒來製作陶片，透過身體力行向土地學習並保持連結。<br />
            作品以麻線來懸掛數百件陶片，創造一個多層次的圓形空間，<br />
            在木灰色的舊穀倉裡，像是一個時光隧道，更是一場人類對於土地無盡追溯的精神儀式。<br />
            圓形，有象徵和諧、融為一體、圓滿之意。
          </p>

          <div class="flex flex-col items-center gap-6 lg:flex-row">
            <div class="lg:w-1/3">
              <img src="/photo of ART/artist.svg" alt="Artist" class="rounded-lg" />
            </div>
            <p class="text-left text-sm leading-relaxed text-gray-300 lg:w-2/3">
              Aritst/海地·葉（Heidi Yip）<br />
              於1978年在香港出生，<br />
              畢業於多倫多安省藝術與設計學院之後，<br />
              自己到墨西哥、西藏、戈壁、紐約等地旅行尋找創作靈感，<br />
              最後到了台灣，<br />
              一個被太平洋包圍的小島，<br />
              激起她無限的創作熱情。
            </p>
          </div>
        </div>
      </section>

      <!-- Section 3: 豆之間 | 豆仔間 -->
      <section class="mb-20">
        <div class="mb-10 overflow-hidden rounded-lg">
          <img src="/photo of ART/combine.png" alt="豆之間" class="w-full object-cover" />
        </div>

        <div class="mx-auto max-w-3xl text-center">
          <h2 class="mb-4 text-2xl font-bold lg:text-3xl">豆之間 | 豆仔間</h2>
          <p class="mb-4 text-lg text-primary">
            時代 <em>X</em> 食現
          </p>
          <p class="mb-8 text-sm leading-relaxed text-gray-300">
            豆仔間<br />
            早期傳統製作豆製品的場所<br /><br />
            豆之間<br />
            一個將光陰與藝術<br />
            一同實現的新食代
          </p>

          <h3 class="mb-3 text-lg font-bold">結合機緣</h3>
          <p class="mb-8 text-sm leading-relaxed text-gray-300">
            池上豆之間有著老穀倉歷史歲月的痕跡，也有藝術家眼中的池上，<br />
            更有池上人對老穀倉懷念的味道，同時也看見老穀倉的新生。<br />
            關於池上豆之間成立的契機，池上栽種約20公頃的黃豆，照顧小農<br />
            解決銷售問題，支持本土國產雜糧，縮短食物哩程，<br />
            池上米很優、池上的黃豆很香、池上的蔬果很鮮甜，<br />
            池上的美好希望藉由【池上豆之間】 讓您看見不一樣的池上。
          </p>

          <!-- Gallery -->
          <div class="mb-10 grid grid-cols-3 gap-4">
            <img src="/photo of ART/show1.png" alt="" class="rounded-lg" />
            <img src="/photo of ART/show2.png" alt="" class="rounded-lg" />
            <img src="/photo of ART/show3.png" alt="" class="rounded-lg" />
          </div>

          <div class="overflow-hidden rounded-lg">
            <img src="/photo of ART/final.png" alt="" class="w-full object-cover" />
          </div>
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
    </section>
  </div>
</template>
