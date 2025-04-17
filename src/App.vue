<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

function isActive(name) {
  const matchedRoute = route.matched[0];

  if (!matchedRoute) return false;

  if (matchedRoute.name) {
    return matchedRoute.name === name;
  } else if (matchedRoute.children) {
    return matchedRoute.children.some((child) => child.name === name);
  }
}
</script>

<template>
  <div class="fixed flex flex-col h-full max-h-screen w-full overflow-hidden">
    <div class="relative h-full">
      <RouterView />
    </div>
    <div class="bg-gray-800 text-white text-center h-32">
      <div class="flex flex-row justify-evenly items-center">
        <RouterLink
          :to="{ name: 'home' }"
          class="hover:underline pt-6 pb-10 px-6"
          :class="{ 'text-blue-500': isActive('home') }"
        >
          Home
        </RouterLink>
        <RouterLink
          :to="{ name: 'about' }"
          class="hover:underline pt-6 pb-10 px-6"
          :class="{ 'text-blue-500': isActive('about') }"
        >
          About
        </RouterLink>
        <RouterLink
          :to="{ name: 'profileMenu' }"
          class="hover:underline pt-6 pb-10 px-6"
          :class="{ 'text-blue-500': isActive('profileMenu') }"
        >
          Profile
        </RouterLink>
      </div>
    </div>
  </div>
</template>
