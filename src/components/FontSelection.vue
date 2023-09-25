<script  setup lang="ts">
import { ref } from "vue"
const emit = defineEmits(['FontChanged'])
const fontname = ref("Arial")
function onFontLockedIn(){
    emit("FontChanged", fontname)
}

</script>
<template>
    <div>
        <div class="mb-4" >
            
            <label for="font_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Font name</label>
            <input type="text" id="font_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="fontname">
         
            <button type="button" class="py-2.5 px-5 mr-2 mb-2 mt-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" @click="onFontLockedIn">Set font</button>

        </div>
   </div>
</template>

<style></style>