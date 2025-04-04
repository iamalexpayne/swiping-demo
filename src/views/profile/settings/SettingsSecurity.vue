<script setup></script>

<template>
  <div class="bg-green-200 w-full h-screen flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold text-gray-800">Security</h1>

    <RouterLink
      :to="{ name: 'profileSettingsMenu' }"
      class="text-green-500 hover:underline mt-4"
    >
      Back to Settings
    </RouterLink>
  </div>
</template>
