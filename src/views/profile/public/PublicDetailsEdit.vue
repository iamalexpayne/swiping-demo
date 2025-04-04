<script setup></script>

<template>
  <div class="bg-green-200 w-full h-screen flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold text-gray-800">Edit Public Profile</h1>

    <RouterLink
      :to="{ name: 'public' }"
      class="text-green-500 hover:underline mt-4"
    >
      Public Profile
    </RouterLink>
  </div>
</template>
