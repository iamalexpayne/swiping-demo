import { ref, shallowRef } from 'vue';

export const routeStack = ref([]);
export const parentView = shallowRef(null);
export const currentView = shallowRef(null);
export const childView = shallowRef(null);
export const isGoingBack = ref(false);

export async function getView(pathName, router) {
  const path = router.getRoutes().find((route) => route.name === pathName);

  const subComponentDefinition = path.components.default;

  const subComponent = typeof subComponentDefinition === 'function' ? await subComponentDefinition() : subComponentDefinition;

  return subComponent.default || subComponent;
}
