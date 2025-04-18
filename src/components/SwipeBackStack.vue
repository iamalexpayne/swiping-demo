<script setup>
import { backStepCount, isBackTransition, swipeBackStack } from '@/composables/useSwipeBackStack';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

function getComponentProps(matchingRoute) {
  if (typeof matchingRoute.props?.default === 'function') {
    return matchingRoute.props.default(route);
  } else if (typeof matchingRoute.props?.default === 'object') {
    return matchingRoute.props.default;
  } else if (matchingRoute.props?.default === true) {
    return route.params;
  }
  return {};
}

const matchedRoutes = computed(() => {
  return route.matched.slice(1);
});

const currentIndex = computed(() => {
  return matchedRoutes.value.length - 1;
});

const translateX = ref(0);
let startX = 0;
let startTime = 0;
const isDragging = ref(false);

const isNewSwipeBackStack = computed(() => {
  return swipeBackStack.value[0] !== route.matched[1]?.name;
});

const transformView = computed(() => {
  if (isNewSwipeBackStack.value) {
    return `translateX(0px)`;
  } else if (isDragging.value) {
    return `translateX(${translateX.value}px)`;
  } else if (isBackTransition.value) {
    return `translateX(-${(currentIndex.value - backStepCount.value) * 100}%)`;
  } else {
    return `translateX(-${currentIndex.value * 100}%)`;
  }
});

function handleTouchStart(event) {
  startX = event.touches[0].clientX;

  if (startX <= 50 && currentIndex.value > 0) {
    translateX.value = -currentIndex.value * window.innerWidth;
    isDragging.value = true;
  }
}

function handleTouchMove(event) {
  if (!isDragging.value) return;

  startTime = performance.now();

  const delta = event.touches[0].clientX - startX;
  translateX.value = Math.min(0, -currentIndex.value * window.innerWidth + delta);
}

function isFlick(event) {
  const time = performance.now() - startTime;
  const distance = event.changedTouches[0].clientX - startX;
  const velocity = distance / time;

  return velocity > 0.5 && distance > 50;
}

async function handleTouchEnd(event) {
  if (!isDragging.value) return;

  const dragDistance = event.changedTouches[0].clientX - startX;
  const threshold = window.innerWidth * 0.5;

  if (dragDistance > threshold || isFlick(event)) {
    const targetRouteName = swipeBackStack.value.at(-2);
    router.push({ name: targetRouteName });
  } else {
    animateTranslateX(-currentIndex.value * window.innerWidth);
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

async function handleTransitionEnd() {
  if (isBackTransition.value) {
    isBackTransition.value();
    isBackTransition.value = null;
  }
}
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
    <div
      class="flex flex-row h-full"
      :class="{ 'transition-transform duration-600 ease-in-out': !isDragging && !isNewSwipeBackStack }"
      :style="{
        transform: transformView,
      }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @transitionend.self="handleTransitionEnd"
    >
      <component
        v-for="(matchingRoute, index) in matchedRoutes"
        :key="index"
        :is="matchingRoute.components.default"
        v-bind="getComponentProps(matchingRoute)"
        class="shrink-0"
      />
    </div>
  </div>
</template>
