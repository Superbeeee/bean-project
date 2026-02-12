<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="pt-[120px] lg:pt-[140px]">
    <div class="flex flex-col lg:flex-row">
      <!-- Map -->
      <div class="lg:w-1/2">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4758.3999964308205!2d121.21810944347374!3d23.125334678598193!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb114d01d9bbf8af8!2z5rGg5LiK6LGG5LmL6ZaT!5e0!3m2!1szh-TW!2stw!4v1644226437963!5m2!1szh-TW!2stw"
          class="h-[400px] w-full border-0 lg:h-[600px]"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>

      <!-- Info -->
      <div class="flex-1 px-6 py-8 lg:px-12">
        <h2 class="mb-8 text-2xl font-bold">{{ t('map.title') }}</h2>

        <div class="space-y-8">
          <!-- Store Info -->
          <div class="flex items-start gap-4">
            <div class="shrink-0">
              <img
                src="/photo of MAP/building.png"
                alt="店面"
                class="w-16 transition-transform duration-1000 lg:w-20"
              />
            </div>
            <div class="text-sm leading-relaxed text-gray-700">
              <p>{{ t('map.phone') }}</p>
              <p>{{ t('map.address') }}</p>
              <p>{{ t('map.hours') }}</p>
            </div>
          </div>

          <!-- Transport Info -->
          <div class="flex items-start gap-4">
            <div class="shrink-0">
              <img
                src="/photo of MAP/train-station.png"
                alt="車站"
                class="w-16 transition-transform duration-1000 lg:w-20"
              />
            </div>
            <div class="text-sm leading-relaxed text-gray-700">
              <p>{{ t('map.transport') }}</p>
              <p>{{ t('map.transportDesc1') }}</p>
              <p>{{ t('map.transportDesc2') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
