<script setup>
import { nextTick, ref } from 'vue';

const count = ref(0);

async function increment() {
  count.value++;
  await nextTick();
}

async function decrement() {
  if (count.value > 0) count.value--;
  await nextTick();
}
</script>

<template>
  <div class="bg-red-200 w-full h-full flex flex-col items-center justify-start overflow-y-auto py-24">
    <h1 class="text-4xl font-bold text-gray-800">Home</h1>
    <RouterLink
      :to="{ name: 'homeSub' }"
      class="text-blue-500 hover:underline mt-4"
    >
      Go to Child
    </RouterLink>
    <RouterLink
      :to="{ name: 'homeSub1' }"
      class="text-green-500 hover:underline mt-4"
    >
      Go to Other Child
    </RouterLink>

    <div class="mt-8 p-4 bg-white rounded shadow-md">
      <p class="mb-4 text-xl">Count: {{ count }}</p>
      <button
        @click="increment"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Increment
      </button>
      <button
        @click="decrement"
        class="bg-red-500 text-white px-4 py-2 rounded ml-2"
      >
        - Decrement
      </button>
    </div>

    <ul class="py-24 px-6 flex flex-col gap-2">
      <li
        v-for="i in count"
        :key="i"
        class="p-4 w-full bg-white"
      >
        {{ i }}
        <RouterLink
          v-if="i % 2 === 0"
          :to="{ name: 'homeSub' }"
          class="text-blue-500 hover:underline mt-4"
        >
          Go to Sub View
        </RouterLink>
        <RouterLink
          v-else
          :to="{ name: 'homeSub1' }"
          class="text-green-500 hover:underline mt-4"
        >
          Go to Other Sub View
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
