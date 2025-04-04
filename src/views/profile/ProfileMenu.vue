<script setup></script>

<template>
  <div class="bg-blue-200 w-full h-screen flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold text-gray-800">Profile</h1>
    <ul>
      <li>
        <RouterLink :to="{ name: 'public' }">Public Profile</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'profileSettingsMenu' }">Settings</RouterLink>
      </li>
    </ul>
  </div>
</template>
