import { ref } from 'vue';

export const swipeBackStack = ref([]);
export const isBackTransition = ref(null);
export const backStepCount = ref(1);

export const clearSwipeBackStack = () => {
  swipeBackStack.value = [];
};

export const transitionBack = async (steps = 1) => {
  backStepCount.value = steps;
  await new Promise((resolve) => {
    isBackTransition.value = resolve;
  });
};

export const handleSwipeBackStack = async (to) => {
  const targetRouteIndex = swipeBackStack.value.indexOf(to.name);
  const rootRouteName = to.matched[1].name;

  // if not in the same stack, clear the stack
  if (rootRouteName !== swipeBackStack.value[0]) {
    clearSwipeBackStack();
  }

  // if stack is empty, build the stack
  if (swipeBackStack.value.length < 1) {
    for (let i = 1; i < to.matched.length; i++) {
      const route = to.matched[i];
      if (route.name) {
        swipeBackStack.value.push(route.name);
      } else {
        console.error('Route name is missing for route:', route);
      }
    }
  }

  // if the target route is not in the stack, add target route to the stack
  else if (targetRouteIndex === -1) {
    swipeBackStack.value.push(to.name);
  }

  // if the target route is in the stack, remove all routes after it
  else if (targetRouteIndex > -1) {
    const stepsBack = swipeBackStack.value.length - (targetRouteIndex + 1);
    swipeBackStack.value.splice(targetRouteIndex + 1);
    await transitionBack(stepsBack);
  }
};
