<script setup>
import { computed, ref, useAttrs, watch } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  display: {
    type: [String, Number],
    default: null,
  },
  direction: {
    type: String,
    default: null,
    validator: (value) => value === null || value === "up" || value === "down",
  },
});

const attrs = useAttrs();
const direction = ref("down");
const renderKey = ref(0);
const previousValue = ref(props.value);

watch(
  () => props.value,
  (newValue, oldValue) => {
    if (typeof oldValue === "number") {
      direction.value = newValue >= oldValue ? "up" : "down";
    }
    previousValue.value = newValue;
    renderKey.value += 1;
  },
  { immediate: true }
);

const renderedValue = computed(() =>
  props.display !== null && props.display !== undefined
    ? props.display
    : props.value
);

const transitionName = computed(() => {
  const dir = props.direction || direction.value;
  return dir === "up" ? "slide-up" : "slide-down";
});
</script>

<template>
  <span
    v-bind="attrs"
    class="inline-flex overflow-hidden align-baseline"
  >
    <transition :name="transitionName" mode="out-in">
      <span :key="`${renderKey}-${renderedValue}`" class="block">
        {{ renderedValue }}
      </span>
    </transition>
  </span>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.2s ease;
}

.slide-up-enter-from {
  transform: translateY(-100%);
}
.slide-up-leave-to {
  transform: translateY(100%);
}

.slide-down-enter-from {
  transform: translateY(100%);
}
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
