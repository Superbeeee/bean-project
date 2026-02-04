<script setup lang="ts">
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center pt-[120px] lg:pt-[140px]">
    <div class="mx-auto max-w-lg px-4 text-center">
      <h2 class="mb-6 font-serif text-2xl italic">Thank you for your order!</h2>
      <div class="text-sm leading-relaxed text-gray-600">
        <p>感謝您的訂購</p>
        <p>我們已收到您的訂單</p>
        <br />
        <p>訂單確認後</p>
        <p>將依序為您安排出貨</p>
        <p>届時會以電話或簡訊通知您</p>
        <p>請留意來電訊息</p>
        <br />
        <p>如有任何問題</p>
        <p>歡迎於營業時間來電 089-862050</p>
      </div>

      <RouterLink
        to="/"
        class="mt-8 inline-block rounded bg-black px-8 py-3 text-white no-underline transition-colors hover:bg-primary"
      >
        回到首頁
      </RouterLink>
    </div>
  </div>
</template>
