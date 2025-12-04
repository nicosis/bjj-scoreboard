<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import HeaderBar from "./components/Header.vue";
import Countdown from "./components/Countdown.vue";
import ScoreBoard from "./components/ScoreBoard.vue";
import competitorsData from "./data/competitors.json";
import { useCountdown } from "./composables/useCountdown";
console.log("Competitors Data:", competitorsData);

const organizer = ref("INTERCLUB 2025 - MG TEAM BARCELONA");
const category = ref("Categoría");
const tatami = ref("Tatami");
const isDark = ref(true);
const isCompactHeight = ref(false);
const isMediumLandscape = ref(false);
const isNarrowWidth = ref(false);
const isLaptopViewport = ref(false);

const players = reactive([
  {
    id: "left",
    name: "Competidor A",
    team: "MG TEAM BARCELONA",
    points: 0,
    advantages: 0,
    penalties: 0,
  },
  {
    id: "right",
    name: "Competidor B",
    team: "MG TEAM BARCELONA",
    points: 0,
    advantages: 0,
    penalties: 0,
  },
]);
const competitors = competitorsData ?? [];

const { time, isRunning, start, pause, reset, addTime, subtractTime } =
  useCountdown(5 * 60);
const audioContext = ref(null);

const rootClasses = computed(() => [
  "relative flex h-auto min-h-screen w-full flex-col overflow-hidden font-display",
  "bg-background-light text-gray-900 dark:bg-background-dark dark:text-white",
]);

const layoutPaddingClass = computed(() =>
  isCompactHeight.value ? "p-3 sm:p-4 md:p-4" : "p-4 sm:p-6 md:p-5"
);

const columnGapClass = computed(() =>
  isCompactHeight.value ? "gap-3 sm:gap-4" : "gap-4 sm:gap-6"
);

const handlePlayerUpdate = ({ id, field, value }) => {
  const player = players.find((entry) => entry.id === id);
  if (player && field in player) {
    player[field] = value;
  }
};

const handleScoreChange = ({ id, points, advantages, penalties }) => {
  const player = players.find((entry) => entry.id === id);
  if (player) {
    player.points = points;
    player.advantages = advantages;
    player.penalties = penalties;
  }
};

const setOrganizer = (value) => {
  organizer.value = value;
};

const setCategory = (value) => {
  category.value = value;
};

const setTatami = (value) => {
  tatami.value = value;
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const resetAll = () => {
  // Resetea el temporizador
  reset();

  // Resetea los marcadores de ambos jugadores
  players.forEach((player) => {
    player.points = 0;
    player.advantages = 0;
    player.penalties = 0;
  });
};

const ensureAudioContext = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext || null;
  if (!AudioContextClass) {
    return null;
  }
  if (!audioContext.value) {
    audioContext.value = new AudioContextClass();
  }
  return audioContext.value;
};

const playEndSound = () => {
  const ctx = ensureAudioContext();
  if (!ctx) {
    return;
  }

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const duration = 1.2;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);

  gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(
    0.00001,
    ctx.currentTime + duration
  );

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
};

const updateViewportFlags = () => {
  if (typeof window === "undefined") {
    return;
  }
  isCompactHeight.value = window.innerHeight <= 820;
  isMediumLandscape.value =
    window.innerWidth >= 1180 &&
    window.innerWidth <= 1500 &&
    window.innerHeight <= 760;
  isNarrowWidth.value = window.innerWidth <= 1000;
  isLaptopViewport.value =
    window.innerWidth <= 1366 && window.innerHeight <= 768;
};

const handleKeyPress = (event) => {
  // Verificar si el usuario está editando un campo (input o textarea con foco)
  const activeElement = document.activeElement;
  const isEditingField =
    activeElement &&
    (activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.isContentEditable);

  // Si está editando, no ejecutar las acciones de teclado globales
  if (isEditingField) {
    return;
  }

  // Barra espaciadora: Play/Pause
  if (
    event.code === "Space" ||
    event.code === "Pause" ||
    event.key === "Pause"
  ) {
    event.preventDefault();
    if (isRunning.value) {
      pause();
    } else {
      start();
    }
  }

  // Tecla Escape: Reset completo
  if (event.code === "Escape" || event.key === "Escape") {
    event.preventDefault();
    resetAll();
  }
};

onMounted(() => {
  updateViewportFlags();
  window.addEventListener("keydown", handleKeyPress);
  window.addEventListener("resize", updateViewportFlags);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
  window.removeEventListener("resize", updateViewportFlags);
  if (audioContext.value) {
    audioContext.value.close();
    audioContext.value = null;
  }
});

watch(
  time,
  (newVal, oldVal) => {
    if (oldVal > 0 && newVal === 0) {
      playEndSound();
    }
  },
  { flush: "post" }
);
</script>

<template>
  <div :class="[{ dark: isDark }, ...rootClasses]">
    <div class="layout-container flex h-full grow flex-col">
      <div :class="['flex flex-1 justify-center', layoutPaddingClass]">
        <div
          :class="[
            'layout-content-container flex max-w-7xl flex-1 flex-col',
            columnGapClass,
          ]"
        >
          <HeaderBar
            :organizer="organizer"
            :category="category"
            :tatami="tatami"
            :is-dark="isDark"
            :compact="isCompactHeight"
            :narrow="isNarrowWidth"
            @update:organizer="setOrganizer"
            @update:category="setCategory"
            @update:tatami="setTatami"
            @toggle-theme="toggleTheme"
          />

          <Countdown
            :time="time"
            :is-running="isRunning"
            :compact="isCompactHeight"
            @play="start"
            @pause="pause"
            @reset="resetAll"
            @add-minute="() => addTime(60)"
            @subtract-minute="() => subtractTime(60)"
            @add-second="() => addTime(1)"
            @subtract-second="() => subtractTime(1)"
          />

          <ScoreBoard
            :players="players"
            :compact="isCompactHeight"
            :competitors="competitors"
            :condensed-stats="isMediumLandscape"
            :laptop="isLaptopViewport"
            @update-player="handlePlayerUpdate"
            @score-change="handleScoreChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
