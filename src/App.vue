<script setup lang="ts">
import StempelView from './components/StempelView.vue'
import FontSelection from './components/FontSelection.vue';
import { ref } from 'vue'
const count = ref("Stamp text")
const slider = ref(2.5)
const height = ref(0.2)
const blur = ref(0)
const font = ref("Verdana")

function fontChangedEvent(newfont: any) {
  font.value = newfont.value
}

</script>

<template>
  <header>

  </header>

  <main class="max-w-1280">
    <div class="container mx:auto">
      <div class="mb-2">
        <label for="large-input" class="block mb-2 text-sm font-medium
    text-gray-900 dark:text-white">Stamp text (Maximum 15 Characters)</label><br>
        <input type="text" id="large-input" size="15" maxlength="15" class="block w-full p-4
    text-gray-900
    border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500
    focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
    dark:focus:border-blue-500" v-model="count as string">
        <label for="steps-range" class="w-screen block my-5 text-sm font-medium
      text-gray-900 dark:text-white">Stamp
          height</label>
        <div class="grid grid-flow-row-dense grid-cols-5 gap-4 mb-5">
          <input id="steps-range" type="range" min="0" max="5" v-model="slider as
            number" step="0.5" class="col-span-4 h-2 bg-gray-200 rounded-lg
        appearance-none cursor-pointer
dark:bg-gray-700">
          <label class="block text-lg align-middle font-medium text-gray-900
        dark:text-white text-center">{{ slider }}</label>
        </div>
        <label for="height-range" class="w-screen block my-5 text-sm font-medium
      text-gray-900 dark:text-white">Embossing
          height</label>
        <div class="grid grid-flow-row-dense grid-cols-5 gap-4 mb-5">
          <input id="height-range" type="range" min="0" max="1" v-model="height as number" step="0.05" class="col-span-4 h-2
        bg-gray-200 rounded-lg appearance-none cursor-pointer 
dark:bg-gray-700">
          <label class="block text-lg align-middle font-medium text-gray-900
dark:text-white  text-center ">{{ height }}</label>
        </div>
        <label for="blur-range" class="w-screen block my-5 text-sm font-medium
text-gray-900 dark:text-white">Blur</label>
        <div class="grid grid-flow-row-dense grid-cols-5 gap-4 mb-5">
          <input id="blur-range" type="range" min="0" max="8" v-model="blur as number" step="1" class="col-span-4 h-2 bg-gray-200 rounded-lg
          appearance-none cursor-pointer
dark:bg-gray-700">
          <label class="block text-lg align-middle font-medium text-gray-900
dark:text-white  text-center">{{ blur }}</label>
        </div>
      </div>
      <FontSelection @font-changed="fontChangedEvent"></FontSelection>
      <StempelView :msg="count as string" :height="height as number" :padding="slider as number" :blurryness="blur"
        :font="font" />
      <span class="text-sm p-4"> Note: The image will be flipped on export.</span>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}
</style>
