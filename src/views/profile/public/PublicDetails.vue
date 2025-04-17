<script setup></script>

<template>
  <div class="bg-green-200 opacity-80 w-full h-full flex flex-col items-center justify-center">
    <RouterLink
      :to="{ name: 'profileMenu' }"
      class="text-green-500 hover:underline mt-4"
    >
      < Back to Profile
    </RouterLink>
    <h1 class="text-4xl font-bold text-gray-800">Public Profile</h1>

    <RouterLink
      :to="{ name: 'profilePublicDetailsEdit' }"
      class="text-green-500 hover:underline mt-4"
    >
      Edit Public Profile
    </RouterLink>
  </div>
</template>
