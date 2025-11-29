<script setup>
import { computed, ref, watch } from "vue";
import SlidingNumber from "./SlidingNumber.vue";

const props = defineProps({
  time: {
    type: Number,
    required: true,
  },
  isRunning: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "play",
  "pause",
  "reset",
  "add-minute",
  "subtract-minute",
  "add-second",
  "subtract-second",
]);

const minutesValue = computed(() => Math.floor(props.time / 60));
const secondsValue = computed(() => props.time % 60);
const minutesDisplay = computed(() =>
  minutesValue.value.toString().padStart(2, "0")
);
const secondsDisplay = computed(() =>
  secondsValue.value.toString().padStart(2, "0")
);

const minuteDirection = ref("down");
const secondDirection = ref("down");

watch(
  minutesValue,
  (newVal, oldVal) => {
    if (typeof oldVal !== "number") {
      return;
    }
    minuteDirection.value = newVal >= oldVal ? "up" : "down";
  },
  { flush: "sync" }
);

watch(
  secondsValue,
  (newVal, oldVal) => {
    if (typeof oldVal !== "number") {
      return;
    }

    if (oldVal === 0 && newVal === 59) {
      secondDirection.value = "down";
      return;
    }

    if (oldVal === 59 && newVal === 0) {
      secondDirection.value = "up";
      return;
    }

    secondDirection.value = newVal >= oldVal ? "up" : "down";
  },
  { flush: "sync" }
);
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4 py-4 sm:py-6 md:flex-row">
    <div class="relative flex flex-1 items-center justify-center">
      <div
        class="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col gap-2 opacity-80"
      >
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-500/10 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-500/20 disabled:opacity-40 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          :disabled="isRunning"
          @click="$emit('add-minute')"
        >
          +
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-500/10 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-500/20 disabled:opacity-40 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          :disabled="isRunning"
          @click="$emit('subtract-minute')"
        >
          -
        </button>
      </div>
      <h1
        class="flex items-baseline gap-6 text-white text-[20vw] font-black leading-none tracking-[0.05em] sm:text-[16vw] md:text-[13vw]"
        style="font-feature-settings: 'tnum' on, 'lnum' on"
      >
        <SlidingNumber
          :value="minutesValue"
          :display="minutesDisplay"
          :direction="minuteDirection"
        />
        <span class="text-[0.8em]">:</span>
        <SlidingNumber
          :value="secondsValue"
          :display="secondsDisplay"
          :direction="secondDirection"
        />
      </h1>
      <div
        class="absolute right-16 top-1/2 flex -translate-y-1/2 flex-col gap-2 opacity-80 sm:right-20 md:right-24"
      >
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-500/10 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-500/20 disabled:opacity-40 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          :disabled="isRunning"
          @click="$emit('add-second')"
        >
          +
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-500/10 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-500/20 disabled:opacity-40 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          :disabled="isRunning"
          @click="$emit('subtract-second')"
        >
          -
        </button>
      </div>
      <div
        class="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-2"
      >
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 text-green-400 transition hover:bg-green-500/30 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-green-500/30 dark:text-green-300"
          :disabled="isRunning"
          @click="$emit('play')"
        >
          <span class="material-symbols-outlined !text-3xl">play_arrow</span>
        </button>
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-500 transition hover:bg-yellow-500/30 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-yellow-500/30 dark:text-yellow-400"
          :disabled="!isRunning"
          @click="$emit('pause')"
        >
          <span class="material-symbols-outlined !text-3xl">pause</span>
        </button>
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20 text-red-500 transition hover:bg-red-500/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-red-500/30 dark:text-red-400"
          @click="$emit('reset')"
        >
          <span class="material-symbols-outlined !text-3xl">replay</span>
        </button>
      </div>
    </div>
  </div>
</template>
