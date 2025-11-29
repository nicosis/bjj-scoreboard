<script setup>
import { computed, ref, watch } from "vue";
import EditableText from "./EditableText.vue";

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: "left",
  },
});

const emit = defineEmits(["update-name", "update-team", "score-change"]);

const points = ref(props.player.points ?? 0);
const advantages = ref(props.player.advantages ?? 0);
const penalties = ref(props.player.penalties ?? 0);

watch(
  () => props.player.points,
  (value) => {
    if (typeof value === "number") {
      points.value = Math.max(0, value);
    }
  }
);

watch(
  () => props.player.advantages,
  (value) => {
    if (typeof value === "number") {
      advantages.value = Math.max(0, value);
    }
  }
);

watch(
  () => props.player.penalties,
  (value) => {
    if (typeof value === "number") {
      penalties.value = Math.min(0, Math.max(-99, value));
    }
  }
);

const isLeft = computed(() => props.variant === "left");

const pointsCardClass = computed(() =>
  isLeft.value ? "bg-green-500 text-white" : "bg-white text-gray-900"
);

const plusButtonClass = computed(() =>
  isLeft.value ? "bg-white/20 text-white" : "bg-black/10 text-gray-900"
);

const minusButtonClass = computed(() =>
  isLeft.value ? "bg-black/20 text-white" : "bg-black/20 text-white"
);

const nameDisplayClass = computed(() =>
  isLeft.value
    ? "text-[4vw] sm:text-4xl font-bold leading-tight tracking-tight uppercase text-white"
    : "text-[4vw] sm:text-4xl font-bold leading-tight tracking-tight uppercase text-gray-900 dark:text-white"
);

const teamDisplayClass = computed(() =>
  isLeft.value
    ? "text-[2vw] sm:text-base font-normal uppercase text-white/80"
    : "text-[2vw] sm:text-base font-normal uppercase text-gray-600 dark:text-gray-300"
);

const emitScore = () => {
  emit("score-change", {
    id: props.player.id,
    points: points.value,
    advantages: advantages.value,
    penalties: penalties.value,
  });
};

const addPoints = (value) => {
  points.value = Math.max(0, points.value + value);
  emitScore();
};

const subtractPoints = (value) => {
  points.value = Math.max(0, points.value - value);
  emitScore();
};

const addAdvantage = () => {
  advantages.value = Math.min(99, advantages.value + 1);
  emitScore();
};

const subtractAdvantage = () => {
  advantages.value = Math.max(0, advantages.value - 1);
  emitScore();
};

const addPenalty = () => {
  penalties.value = Math.max(-99, penalties.value - 1);
  emitScore();
};

const subtractPenalty = () => {
  penalties.value = Math.min(0, penalties.value + 1);
  emitScore();
};

const updateName = (value) => {
  emit("update-name", { id: props.player.id, value });
};

const updateTeam = (value) => {
  emit("update-team", { id: props.player.id, value });
};

const positiveButtons = [4, 3, 2];
const negativeButtons = [-4, -3, -2];
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <div class="text-center">
      <div
        class="overflow-hidden rounded-lg border border-white/20 bg-white/5 p-3 dark:border-white/10"
      >
        <EditableText
          :model-value="player.name"
          placeholder="COMPETITOR NAME"
          :display-class="`${nameDisplayClass} focus:outline-none`"
          input-class="text-center text-4xl font-bold uppercase tracking-tight"
          @update:model-value="updateName"
        />
      </div>
      <div
        class="mt-3 overflow-hidden rounded-lg border border-white/20 bg-white/5 p-[0.4rem] dark:border-white/10"
      >
        <EditableText
          :model-value="player.team"
          placeholder="NOMBRE DE LA ACADEMIA"
          :display-class="`${teamDisplayClass} focus:outline-none`"
          input-class="text-center text-[0.7rem] uppercase tracking-wide"
          @update:model-value="updateTeam"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2 sm:gap-3 flex-1">
      <div
        class="rounded-xl p-1 sm:p-1.5 flex items-center justify-center relative flex-[0.9]"
        :class="pointsCardClass"
      >
        <span
          class="font-black leading-none"
          style="font-feature-settings: 'tnum' on, 'lnum' on"
        >
          <span class="text-[11vw] sm:text-5xl md:text-[7vw] lg:text-[12rem]">
            {{ points }}
          </span>
        </span>
        <div class="absolute inset-y-0 left-3 flex flex-col justify-around">
          <button
            v-for="value in negativeButtons"
            :key="`remove-${value}`"
            type="button"
            class="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs sm:text-sm font-bold"
            :class="minusButtonClass"
            @click="subtractPoints(Math.abs(value))"
          >
            {{ value }}
          </button>
        </div>
        <div class="absolute inset-y-0 right-3 flex flex-col justify-around">
          <button
            v-for="value in positiveButtons"
            :key="`add-${value}`"
            type="button"
            class="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs sm:text-sm font-bold"
            :class="plusButtonClass"
            @click="addPoints(value)"
          >
            +{{ value }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:gap-4">
        <div
          class="bg-amber-500 text-white rounded-lg p-3 flex items-center justify-center relative"
        >
          <span
            class="absolute left-3 top-2 text-xs font-semibold uppercase tracking-[0.35em]"
          >
            Ventajas
          </span>
          <div
            class="absolute inset-y-0 right-3 flex flex-col justify-center gap-2"
          >
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-white"
              @click="addAdvantage"
            >
              +
            </button>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md bg-black/20 text-white"
              @click="subtractAdvantage"
            >
              -
            </button>
          </div>
          <span
            class="font-bold text-5xl sm:text-6xl"
            style="font-feature-settings: 'tnum' on, 'lnum' on"
          >
            {{ advantages }}
          </span>
        </div>
        <div
          class="bg-red-600 text-white rounded-lg p-3 flex items-center justify-center relative"
        >
          <span
            class="absolute left-3 top-2 text-xs font-semibold uppercase tracking-[0.35em]"
          >
            PENALIDADES
          </span>
          <div
            class="absolute inset-y-0 right-3 flex flex-col justify-center gap-2"
          >
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-white"
              @click="addPenalty"
            >
              -
            </button>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md bg-black/20 text-white"
              @click="subtractPenalty"
            >
              +
            </button>
          </div>
          <span
            class="font-bold text-5xl sm:text-6xl"
            style="font-feature-settings: 'tnum' on, 'lnum' on"
          >
            {{ penalties }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
