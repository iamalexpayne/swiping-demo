<script setup>
import { rootPath, rootView, subView } from '@/composables/useWrapperSwipeBackVariables';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isIncomingView = computed(() => {
  return route.name === rootPath.value?.name;
});

let startX = 0;
let startTime = 0;
const isDragging = ref(false);
const translateX = ref(0);
const innerWidth = ref(window.innerWidth);

function handleTouchStart(event) {
  startX = event.touches[0].clientX;

  if (!isIncomingView.value && startX <= 50) {
    isDragging.value = true;
  }
}

function handleTouchMove(event) {
  if (!isDragging.value) return;

  startTime = performance.now();

  const delta = event.touches[0].clientX - startX;
  translateX.value = Math.max(0, delta);
}

function isFlick() {
  const time = performance.now() - startTime;
  const distance = translateX.value - startX;
  const velocity = distance / time;

  return velocity > 0.5;
}

function handleTouchEnd(event) {
  if (!isDragging.value) return;

  const threshold = innerWidth.value * 0.5;

  if (translateX.value > threshold || isFlick()) {
    animateTranslateX(innerWidth.value, () => {
      translateX.value = 0;
      router.back();
    });
  } else {
    animateTranslateX(0);
  }

  isDragging.value = false;
}

function animateTranslateX(target, onDone) {
  const duration = 100;
  const start = performance.now();
  const initial = translateX.value;

  function step(timestamp) {
    const easeOut = (timestamp) => 1 - Math.pow(1 - timestamp, 3);
    const progress = easeOut(Math.min((timestamp - start) / duration, 1));
    translateX.value = initial + (target - initial) * progress;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (onDone) onDone();
    }
  }

  requestAnimationFrame(step);
}

function updateInnerWidth() {
  innerWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener('resize', updateInnerWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateInnerWidth);
});
</script>

<template>
  <div
    class="relative w-full h-full overflow-hidden bg-black touch-none"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <component
      :is="rootView"
      class="absolute top-0 left-0 z-0 will-change-transform"
      :class="{ 'transition-transform duration-600 ease-in-out': !isDragging }"
      :style="{ transform: `translateX(${isIncomingView ? translateX : translateX - innerWidth}px)` }"
    />

    <component
      :is="subView"
      class="absolute top-0 left-0 z-10 will-change-transform"
      :class="{ 'transition-transform duration-600 ease-in-out': !isDragging }"
      :style="{ transform: `translateX(${isIncomingView ? translateX + innerWidth : translateX}px)` }"
    />
  </div>
</template>
