import { ref } from 'vue';

export const swipeBackStack = ref([]);
export const isBackTransition = ref(null);
export const backStepCount = ref(1);

export const transitionBack = async (steps = 1) => {
  backStepCount.value = steps;
  await new Promise((resolve) => {
    isBackTransition.value = resolve;
  });
};
