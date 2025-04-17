<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

let startX = 0;
let startTime = 0;
const isDragging = ref(false);
const translateX = ref(0);
const innerWidth = ref(window.innerWidth);

const canSwipeBack = computed(() => {
  return route.matched.length > 1;
});

const isLeafNestedView = computed(() => {
  const lastNested = route.matched.length >= 2 && route.matched.at(-1).path === route.path;
  console.log('route path', route.path);
  console.log('last route', route.matched.at(-1).path);
  console.log('isLeafNestedView', lastNested);

  return lastNested;
});

const transformDefaultView = computed(() => {
  if (!canSwipeBack.value || isLeafNestedView.value) {
    return `translateX(${translateX.value}px)`;
  } else {
    return `translateX(${translateX.value - innerWidth.value}px)`;
  }
});

const transformNestedView = computed(() => {
  //   if (isGoingBack.value) {
  //     return `translateX(${translateX.value + innerWidth.value}px)`;
  //   } else
  //   if (childComponent.value && childView.value) {
  //     return `translateX(${translateX.value - innerWidth.value}px)`;
  //   }
  return `translateX(${translateX.value}px)`;
});

function handleTouchStart(event) {
  if (!canSwipeBack.value) return;

  startX = event.touches[0].clientX;

  if (startX <= 50) {
    isDragging.value = true;
  }
}

function handleTouchMove(event) {
  if (!isDragging.value || !canSwipeBack.value) return;

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
  if (!isDragging.value || !parentView.value) return;

  const threshold = innerWidth.value * 0.5;

  if (translateX.value > threshold || isFlick()) {
    isGoingBack.value = true;
    animateTranslateX(innerWidth.value, async () => {
      translateX.value = 0;
      if (routeStack.value.length > 1) {
        const parentRouteName = routeStack.value[routeStack.value.length - 2];
        router.push({ name: parentRouteName });
      }
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
    class="absolute h-full w-full overflow-x-hidden flex flex-row bg-black/50"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
  >
    <div
      v-for="(matchedRoute, index) in route.matched"
      :key="matchedRoute.path"
      class="w-full"
    >
      <div
        :style="{ transform: index === 0 ? transformDefaultView : transformNestedView }"
        class="absolute h-full w-full transition-transform duration-300 ease-out"
      >
        <KeepAlive>
          <component :is="matchedRoute.components.default" />
        </KeepAlive>
      </div>
    </div>
    <!-- <RouterView
      name="nested"
      v-slot="{ Component }"
      class="w-full"
    >
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView> -->
  </div>
</template>
