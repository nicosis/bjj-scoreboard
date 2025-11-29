<script setup>
import { computed } from "vue";

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

const formattedTime = computed(() => {
  const minutes = Math.floor(props.time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (props.time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4 py-4 sm:py-6 md:flex-row">
    <div class="relative flex flex-1 items-center justify-center">
      <div
        class="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col gap-2 opacity-80"
      >
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-500/10 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-500/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          :disabled="isRunning"
          @click="$emit('add-minute')"
        >
          +1m
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-500/10 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-500/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          :disabled="isRunning"
          @click="$emit('subtract-minute')"
        >
          -1m
        </button>
      </div>
      <h1
        class="text-lime-500 text-[12vw] font-black leading-none tracking-tighter sm:text-[10vw] md:text-9xl"
        style="font-feature-settings: 'tnum' on, 'lnum' on"
      >
        {{ formattedTime }}
      </h1>
      <div
        class="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-2 opacity-80"
      >
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-500/10 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-500/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          :disabled="isRunning"
          @click="$emit('add-second')"
        >
          +10s
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-500/10 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-500/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          :disabled="isRunning"
          @click="$emit('subtract-second')"
        >
          -10s
        </button>
      </div>
    </div>
    <div class="flex gap-3 pt-2 md:flex-col md:pt-0">
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold uppercase text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="isRunning"
        @click="$emit('play')"
      >
        Play
      </button>
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold uppercase text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!isRunning"
        @click="$emit('pause')"
      >
        Pause
      </button>
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-sm font-bold uppercase text-white transition hover:bg-red-500"
        @click="$emit('reset')"
      >
        Reset
      </button>
    </div>
  </div>
</template>
