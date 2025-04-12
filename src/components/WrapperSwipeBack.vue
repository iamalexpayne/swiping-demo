<script setup>
import { childView, currentView, getView, isGoingBack, parentView, routeStack } from '@/composables/useWrapperSwipeBack';
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

let startX = 0;
let startTime = 0;
const isDragging = ref(false);
const translateX = ref(0);
const innerWidth = ref(window.innerWidth);

const childComponent = useTemplateRef('childComponent');
const childTranslateX = ref(innerWidth.value);

watch(childComponent, async (val) => {
  if (val) {
    childTranslateX.value = innerWidth.value;

    await nextTick();

    requestAnimationFrame(() => {
      childTranslateX.value = 0;
    });
  }
});

const transformChildView = computed(() => {
  return `translateX(${childTranslateX.value}px)`;
});

const parentComponent = useTemplateRef('parentComponent');

watch(parentComponent, () => {
  if (parentComponent.value?.$el) {
    parentComponent.value.$el.style.transform = `translateX(-${innerWidth.value}px)`;
  }
});

const transformParentView = computed(() => {
  if (isGoingBack.value) {
    return `translateX(${translateX.value}px)`;
  } else {
    return `translateX(${translateX.value - innerWidth.value}px)`;
  }
});

const transformCurrentView = computed(() => {
  if (isGoingBack.value) {
    return `translateX(${translateX.value + innerWidth.value}px)`;
  } else if (childComponent.value && childView.value) {
    return `translateX(${translateX.value - innerWidth.value}px)`;
  }
  return `translateX(${translateX.value}px)`;
});

function handleTouchStart(event) {
  startX = event.touches[0].clientX;

  if (startX <= 50 && parentView.value) {
    isDragging.value = true;
  }
}

function handleTouchMove(event) {
  if (!isDragging.value || !parentView.value) return;

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

async function syncRouteStack() {
  if (isGoingBack.value) {
    currentView.value = parentView.value;
    if (routeStack.value.length > 1) {
      parentView.value = await getView(routeStack.value.at(-2), router);
    } else {
      parentView.value = null;
    }
  } else if (childView.value) {
    parentView.value = currentView.value;
    currentView.value = childView.value;
  }

  isGoingBack.value = false;
  childView.value = null;
  childTranslateX.value = innerWidth.value;
}
</script>

<template>
  <div
    class="relative w-full h-full bg-black"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @transitionend="syncRouteStack"
  >
    <component
      :is="parentView"
      ref="parentComponent"
      class="absolute top-0 left-0 z-0 will-change-transform overflow-y-auto h-full"
      :class="{ 'transition-transform duration-600 ease-in-out': !isDragging }"
      :style="{ transform: transformParentView }"
    />

    <component
      :is="currentView"
      class="absolute top-0 left-0 z-10 will-change-transform overflow-y-auto"
      :class="{ 'transition-transform duration-600 ease-in-out': !isDragging }"
      :style="{ transform: transformCurrentView }"
    />

    <component
      :is="childView"
      ref="childComponent"
      class="absolute top-0 left-0 z-0 will-change-transform overflow-y-auto transition-transform duration-600 ease-in-out"
      :style="{ transform: transformChildView }"
    />
  </div>
</template>
