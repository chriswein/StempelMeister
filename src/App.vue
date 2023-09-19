<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import StempelView from './components/StempelView.vue'
import { ref } from 'vue'
const count = ref("Stempel")
const slider = ref(2.5)
const height = ref(0.2)
const blur = ref(0)

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld :msg="count as unknown as number" />
    </div>
  </header>

  <main class="container">
    <div class="mb-2">
      <label for="large-input" class="block mb-2 text-sm font-medium
    text-gray-900 dark:text-white">Stempeltext (Maximal 24 Zeichen)</label><br>
      <input type="text" id="large-input" size="24" maxlength="24" class="block w-full p-4
    text-gray-900
    border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500
    focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
    dark:focus:border-blue-500" v-model="count as string">
      <label for="steps-range"
        class="w-screen block my-5 text-sm font-medium text-gray-900 dark:text-white">Padding</label>
      <div class="grid grid-flow-row-dense grid-cols-5 gap-4 mb-5">
        <input id="steps-range" type="range" min="0" max="5" v-model="slider as number" step="0.5" class="col-span-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
dark:bg-gray-700">
        <label class="block text-lg align-middle font-medium text-gray-900 dark:text-white">{{ slider }}</label>
      </div>
      <label for="height-range"
        class="w-screen block my-5 text-sm font-medium text-gray-900 dark:text-white">Height</label>
      <div class="grid grid-flow-row-dense grid-cols-5 gap-4 mb-5">
        <input id="height-range" type="range" min="0" max="1" v-model="height as number" step="0.05" class="col-span-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
dark:bg-gray-700">
        <label class="block text-lg align-middle font-medium text-gray-900
dark:text-white">{{ height }}</label>
      </div>
      <label for="blur-range" class="w-screen block my-5 text-sm font-medium
text-gray-900 dark:text-white">Blur</label>
      <div class="grid grid-flow-row-dense grid-cols-5 gap-4 mb-5">
        <input id="blur-range" type="range" min="0" max="8" v-model="blur as number" step="1" class="col-span-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
dark:bg-gray-700">
        <label class="block text-lg align-middle font-medium text-gray-900
dark:text-white">{{ blur }}</label>
      </div>
    </div>
    <StempelView :msg="count as string" :height="height as number" :padding="slider as number" :blurryness="blur" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}
</style>
