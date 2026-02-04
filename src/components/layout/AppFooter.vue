<script setup lang="ts">
</script>

<template>
  <footer class="bg-white transition-all duration-300">
    <!-- Desktop Footer -->
    <div class="flex flex-col items-center justify-center px-4 py-5 lg:flex-row lg:py-0">
      <!-- Info -->
      <div class="mb-5 text-center text-xs leading-[1.8] tracking-wider text-muted lg:mt-[45px] lg:w-[500px] lg:text-left lg:text-[17px] lg:leading-normal lg:text-black">
        |
        <a
          href="https://www.google.com/maps/place/%E6%B1%A0%E4%B8%8A%E8%B1%86%E4%B9%8B%E9%96%93/@23.1247488,121.2197236,15z"
          target="_blank"
          class="text-inherit no-underline"
        >
          台東縣池上鄉中山路通水巷12號
        </a>
        |
        <a href="tel:089862050" class="text-inherit no-underline">089-862050</a>
        |
        <br />
        | Open_Mon.-Fri. 08:00-17:00/Sat.-Sun. 08:00-21:00 |
      </div>

      <!-- Right Side -->
      <div class="lg:w-[450px]">
        <!-- Social Links (desktop only) -->
        <ul class="hidden lg:ml-[240px] lg:mt-10 lg:inline-flex lg:gap-5">
          <li>
            <a href="#" target="_blank">
              <img
                src="/photo/b-logo/b-fb.svg"
                alt="Facebook"
                class="w-[30px] transition-transform duration-300 hover:scale-150"
              />
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img
                src="/photo/b-logo/b-ig.svg"
                alt="Instagram"
                class="w-[30px] transition-transform duration-300 hover:scale-150"
              />
            </a>
          </li>
          <li>
            <RouterLink to="/inquiry">
              <img
                src="/photo/b-logo/b-ask.png"
                alt="洽詢"
                class="w-[30px] transition-transform duration-300 hover:scale-150"
              />
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/cart">
              <img
                src="/photo/b-logo/b-cart.svg"
                alt="購物車"
                class="w-[30px] transition-transform duration-300 hover:scale-150"
              />
            </RouterLink>
          </li>
        </ul>

        <div class="text-center text-xs text-border lg:ml-[156px]">
          Copyright © bean All Rights Reserved
        </div>
      </div>
    </div>

    <!-- Reference -->
    <div class="bg-white px-4 pt-8 pb-4 text-center text-xs">
      <p>
        本網站為緯育TibaMe前端設計工程師班第74期學員專題作品，本平台僅供學習、展示之用。
        參考資源:豆之間、池上鄉農會、葉海地老師作品、部落客不羈、龜記、.but。
      </p>
    </div>
  </footer>
</template>
