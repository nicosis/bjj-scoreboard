<script setup>
import { computed, ref, watch } from "vue";
import EditableText from "./EditableText.vue";
import SlidingNumber from "./SlidingNumber.vue";

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: "left",
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-name", "update-team", "score-change"]);

const points = ref(props.player.points ?? 0);
const advantages = ref(props.player.advantages ?? 0);
const penalties = ref(props.player.penalties ?? 0);
const penaltyDirection = ref("up");

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

const nameToneClass = computed(() =>
  isLeft.value ? "text-white" : "text-gray-900 dark:text-white"
);

const teamToneClass = computed(() =>
  isLeft.value ? "text-white/80" : "text-gray-600 dark:text-gray-300"
);

const nameDisplayClass = computed(() => {
  const size = props.compact
    ? "text-[clamp(1.5rem,4vw,2.5rem)] sm:text-3xl"
    : "text-[4vw] sm:text-4xl";
  return `${size} font-bold leading-tight tracking-tight uppercase ${nameToneClass.value}`;
});

const teamDisplayClass = computed(() => {
  const size = props.compact
    ? "text-[clamp(0.85rem,2.4vw,1rem)] sm:text-sm"
    : "text-[2vw] sm:text-base";
  return `${size} font-normal uppercase ${teamToneClass.value}`;
});

const panelGapClass = computed(() =>
  props.compact ? "gap-3" : "gap-4 sm:gap-6"
);

const nameCardPaddingClass = computed(() =>
  props.compact ? "p-2" : "p-3"
);

const teamCardPaddingClass = computed(() =>
  props.compact ? "p-2" : "p-[0.4rem]"
);

const infoSpacingClass = computed(() =>
  props.compact ? "mt-2" : "mt-3"
);

const scoreStackGapClass = computed(() =>
  props.compact ? "gap-2" : "gap-2 sm:gap-3"
);

const pointsCardPaddingClass = computed(() =>
  props.compact ? "p-1" : "p-1 sm:p-1.5"
);

const pointsValueClass = computed(() =>
  props.compact
    ? "text-[clamp(3.5rem,6vw,7rem)]"
    : "text-[11vw] sm:text-5xl md:text-[7vw] lg:text-[12rem]"
);

const pointsButtonSizeClass = computed(() =>
  props.compact
    ? "h-7 w-7 text-[0.7rem]"
    : "h-7 w-7 sm:h-9 sm:w-9 text-xs sm:text-sm"
);

const pointsControlsGapClass = computed(() =>
  props.compact ? "gap-2" : "gap-3"
);

const topControlsPositionClass = computed(() =>
  props.compact ? "inset-x-2 top-2" : "inset-x-3 top-3"
);

const bottomControlsPositionClass = computed(() =>
  props.compact ? "inset-x-2 bottom-2" : "inset-x-3 bottom-3"
);

const statsGridGapClass = computed(() =>
  props.compact ? "gap-2" : "gap-3 sm:gap-4"
);

const statBoxPaddingClass = computed(() =>
  props.compact ? "p-2" : "p-3"
);

const statLabelOffsetClass = computed(() =>
  props.compact ? "left-2 top-2" : "left-3 top-2"
);

const statLabelTextClass = computed(() =>
  props.compact ? "text-[0.6rem]" : "text-xs"
);

const statButtonOffsetClass = computed(() =>
  props.compact ? "right-2" : "right-3"
);

const statButtonGapClass = computed(() =>
  props.compact ? "gap-1.5" : "gap-2"
);

const statButtonSizeClass = computed(() =>
  props.compact ? "h-6 w-6 text-xs" : "h-7 w-7 text-sm"
);

const statNumberClass = computed(() =>
  props.compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl"
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
  penaltyDirection.value = "up";
  penalties.value = Math.max(-99, penalties.value - 1);
  emitScore();
};

const subtractPenalty = () => {
  penaltyDirection.value = "down";
  penalties.value = Math.min(0, penalties.value + 1);
  emitScore();
};

const updateName = (value) => {
  emit("update-name", { id: props.player.id, value });
};

const updateTeam = (value) => {
  emit("update-team", { id: props.player.id, value });
};

const canSubtractPoints = computed(() => points.value > 0);
const canSubtractAdvantage = computed(() => advantages.value > 0);
const canIncreasePenalty = computed(() => penalties.value < 0);
const penaltiesDisplay = computed(() => {
  const abs = Math.abs(penalties.value);
  return abs > 0 ? `-${abs}` : abs;
});

const positiveButtons = [4, 3, 2];
const negativeButtons = [-4, -3, -2];
</script>

<template>
  <div :class="['flex flex-col', panelGapClass]">
    <div class="text-center">
      <div
        :class="[
          'overflow-hidden rounded-lg border border-white/20 bg-white/5 dark:border-white/10',
          nameCardPaddingClass,
        ]"
      >
        <EditableText
          :model-value="player.name"
          placeholder="Nombre del Competidor"
          :display-class="`${nameDisplayClass} focus:outline-none`"
          input-class="text-center text-4xl font-bold uppercase tracking-tight"
          @update:model-value="updateName"
        />
      </div>
      <div
        :class="[
          'overflow-hidden rounded-lg border border-white/20 bg-white/5 dark:border-white/10',
          infoSpacingClass,
          teamCardPaddingClass,
        ]"
      >
        <EditableText
          :model-value="player.team"
          placeholder="Nombre de la academia / Equipo"
          :display-class="`${teamDisplayClass} focus:outline-none`"
          input-class="text-center text-[0.7rem] uppercase tracking-wide"
          @update:model-value="updateTeam"
        />
      </div>
    </div>

    <div :class="['flex flex-col flex-1', scoreStackGapClass]">
      <div
        :class="[
          'rounded-xl flex items-center justify-center relative flex-[0.9]',
          pointsCardClass,
          pointsCardPaddingClass,
        ]"
      >
        <span
          class="font-black leading-none"
          style="font-feature-settings: 'tnum' on, 'lnum' on"
        >
          <SlidingNumber
            :value="points"
            :class="['block', pointsValueClass]"
          />
        </span>
        <div
          :class="[
            'absolute flex justify-end',
            topControlsPositionClass,
            pointsControlsGapClass,
          ]"
        >
          <button
            v-for="value in positiveButtons"
            :key="`add-${value}`"
            type="button"
            :class="[
              'flex items-center justify-center rounded-lg font-bold',
              pointsButtonSizeClass,
              plusButtonClass,
            ]"
            @click="addPoints(value)"
          >
            +{{ value }}
          </button>
        </div>
        <div
          :class="[
            'absolute flex justify-end',
            bottomControlsPositionClass,
            pointsControlsGapClass,
          ]"
          v-show="canSubtractPoints"
        >
          <button
            v-for="value in negativeButtons"
            :key="`remove-${value}`"
            type="button"
            :class="[
              'flex items-center justify-center rounded-lg font-bold',
              pointsButtonSizeClass,
              minusButtonClass,
            ]"
            @click="subtractPoints(Math.abs(value))"
          >
            {{ value }}
          </button>
        </div>
      </div>

      <div :class="['grid grid-cols-2', statsGridGapClass]">
        <div
          :class="[
            'bg-yellow-400 text-white rounded-lg flex items-center justify-center relative',
            statBoxPaddingClass,
          ]"
        >
          <span
            :class="[
              'absolute font-semibold uppercase tracking-[0.35em]',
              statLabelOffsetClass,
              statLabelTextClass,
            ]"
          >
            Ventajas
          </span>
          <div
            :class="[
              'absolute inset-y-0 flex flex-col justify-center',
              statButtonOffsetClass,
              statButtonGapClass,
            ]"
          >
            <button
              type="button"
              :class="[
                'flex items-center justify-center rounded-md bg-white/20 text-white',
                statButtonSizeClass,
              ]"
              @click="addAdvantage"
            >
              +
            </button>
            <button
              type="button"
              :class="[
                'flex items-center justify-center rounded-md bg-black/20 text-white',
                statButtonSizeClass,
              ]"
              @click="subtractAdvantage"
              v-show="canSubtractAdvantage"
            >
              -
            </button>
          </div>
          <span
            :class="['font-bold', statNumberClass]"
            style="font-feature-settings: 'tnum' on, 'lnum' on"
          >
            <SlidingNumber :value="advantages" />
          </span>
        </div>
        <div
          :class="[
            'bg-red-600 text-white rounded-lg flex items-center justify-center relative',
            statBoxPaddingClass,
          ]"
        >
          <span
            :class="[
              'absolute font-semibold uppercase tracking-[0.35em]',
              statLabelOffsetClass,
              statLabelTextClass,
            ]"
          >
            PENALIDADES
          </span>
          <div
            :class="[
              'absolute inset-y-0 flex flex-col justify-center',
              statButtonOffsetClass,
              statButtonGapClass,
            ]"
          >
            <button
              type="button"
              :class="[
                'flex items-center justify-center rounded-md bg-white/20 text-white',
                statButtonSizeClass,
              ]"
              @click="addPenalty"
            >
              +
            </button>
            <button
              type="button"
              :class="[
                'flex items-center justify-center rounded-md bg-black/20 text-white',
                statButtonSizeClass,
              ]"
              @click="subtractPenalty"
              v-show="canIncreasePenalty"
            >
              -
            </button>
          </div>
          <span
            :class="['font-bold', statNumberClass]"
            style="font-feature-settings: 'tnum' on, 'lnum' on"
          >
            <SlidingNumber
              :value="penaltiesDisplay"
              :direction="penaltyDirection"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
