<script setup></script>

<template>
  <div class="bg-green-200 w-full h-full flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold text-gray-800">Other Child View</h1>
    <RouterLink
      :to="{ name: 'home' }"
      class="text-green-500 hover:underline mt-4"
    >
      Go to Home
    </RouterLink>
  </div>
</template>
