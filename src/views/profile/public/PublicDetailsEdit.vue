<script setup></script>

<template>
  <div class="bg-green-200 w-full h-full flex flex-col items-center justify-center">
    <RouterLink
      :to="{ name: 'profileMenu' }"
      class="text-green-500 hover:underline mt-4"
    >
      < Back to Profile
    </RouterLink>
    <RouterLink
      :to="{ name: 'profilePublicDetails' }"
      class="text-green-500 hover:underline mt-4"
    >
      < Back to Public Profile
    </RouterLink>
    <h1 class="text-4xl font-bold text-gray-800">Edit Public Profile</h1>
  </div>
</template>
