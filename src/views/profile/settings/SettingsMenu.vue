<script setup></script>

<template>
  <div class="bg-green-200 w-full h-full flex flex-col items-center justify-center">
    <RouterLink
      :to="{ name: 'profileMenu' }"
      class="text-green-500 hover:underline mt-4"
    >
      < Back to Profile
    </RouterLink>
    <h1 class="text-4xl font-bold text-gray-800">Settings</h1>
    <RouterLink
      :to="{ name: 'profileSettingsNotifications' }"
      class="text-green-500 hover:underline mt-4"
    >
      Notifications
    </RouterLink>
    <RouterLink
      :to="{ name: 'profileSettingsSecurity' }"
      class="text-green-500 hover:underline mt-4"
    >
      Security
    </RouterLink>
  </div>
</template>
