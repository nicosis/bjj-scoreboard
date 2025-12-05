<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import HeaderBar from "./components/Header.vue";
import Countdown from "./components/Countdown.vue";
import ScoreBoard from "./components/ScoreBoard.vue";
import competitorsData from "./data/competitors.json";
import { useCountdown } from "./composables/useCountdown";
console.log("Competitors Data:", competitorsData);

const defaultPlayers = [
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
];
const defaultCategory = "Categoría";
const organizer = ref("INTERCLUB 2025 - MG TEAM BARCELONA");
const category = ref(defaultCategory);
const tatami = ref("Tatami");
const isDark = ref(true);
const isCompactHeight = ref(false);
const isMediumLandscape = ref(false);
const isNarrowWidth = ref(false);
const isLaptopViewport = ref(false);
const isFullHdViewport = ref(false);
const isResetConfirmVisible = ref(false);

const players = reactive(defaultPlayers.map((player) => ({ ...player })));
const competitors = competitorsData ?? [];

const findPlayerById = (id) => players.find((entry) => entry.id === id);

const adjustPlayerPoints = (id, delta) => {
  const player = findPlayerById(id);
  if (!player) {
    return;
  }
  const current = typeof player.points === "number" ? player.points : 0;
  player.points = Math.max(0, current + delta);
};

const adjustPlayerAdvantages = (id, delta) => {
  const player = findPlayerById(id);
  if (!player) {
    return;
  }
  const current =
    typeof player.advantages === "number" ? player.advantages : 0;
  player.advantages = Math.min(99, Math.max(0, current + delta));
};

const adjustPlayerPenalties = (id, delta) => {
  const player = findPlayerById(id);
  if (!player) {
    return;
  }
  const current =
    typeof player.penalties === "number" ? player.penalties : 0;
  player.penalties = Math.min(0, Math.max(-99, current + delta));
};

const pointsShortcutMap = {
  Digit2: { id: "left", value: 2 },
  Digit3: { id: "left", value: 3 },
  Digit4: { id: "left", value: 4 },
  Digit8: { id: "right", value: 2 },
  Digit9: { id: "right", value: 3 },
  Digit0: { id: "right", value: 4 },
};

const advantageShortcutMap = {
  KeyQ: "left",
  KeyO: "right",
};

const penaltyShortcutMap = {
  KeyW: "left",
  KeyP: "right",
};

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

  // Resetea los marcadores y datos de ambos jugadores
  players.forEach((player, index) => {
    const template = defaultPlayers[index];
    if (template) {
      player.name = template.name;
      player.team = template.team;
      player.points = template.points;
      player.advantages = template.advantages;
      player.penalties = template.penalties;
    } else {
      player.points = 0;
      player.advantages = 0;
      player.penalties = 0;
    }
  });

  // Restablece la categoría inicial
  category.value = defaultCategory;
};

const showResetConfirm = () => {
  isResetConfirmVisible.value = true;
};

const hideResetConfirm = () => {
  isResetConfirmVisible.value = false;
};

const confirmReset = () => {
  resetAll();
  hideResetConfirm();
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
  isFullHdViewport.value =
    window.innerWidth >= 1900 && window.innerHeight >= 1000;
};

const handleScoreShortcuts = (event) => {
  const pointsShortcut = pointsShortcutMap[event.code];
  if (pointsShortcut) {
    event.preventDefault();
    const delta = event.shiftKey ? -pointsShortcut.value : pointsShortcut.value;
    adjustPlayerPoints(pointsShortcut.id, delta);
    return true;
  }

  const advantageTarget = advantageShortcutMap[event.code];
  if (advantageTarget) {
    event.preventDefault();
    const delta = event.shiftKey ? -1 : 1;
    adjustPlayerAdvantages(advantageTarget, delta);
    return true;
  }

  const penaltyTarget = penaltyShortcutMap[event.code];
  if (penaltyTarget) {
    event.preventDefault();
    const delta = event.shiftKey ? 1 : -1;
    adjustPlayerPenalties(penaltyTarget, delta);
    return true;
  }

  return false;
};

const handleKeyPress = (event) => {
  const activeElement = document.activeElement;
  const isEditingField =
    activeElement &&
    (activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.isContentEditable);

  if (isEditingField) {
    return;
  }

  if (handleScoreShortcuts(event)) {
    return;
  }

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
    return;
  }

  if (isResetConfirmVisible.value) {
    if (event.code === "Escape" || event.key === "Escape") {
      event.preventDefault();
      hideResetConfirm();
      return;
    }
    if (event.key === "Enter" || event.code === "Enter") {
      event.preventDefault();
      confirmReset();
      return;
    }
  }

  if (event.code === "Escape" || event.key === "Escape") {
    event.preventDefault();
    showResetConfirm();
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
            :editing-locked="isRunning"
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
            @reset="showResetConfirm"
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
            :full-hd="isFullHdViewport"
            :editing-locked="isRunning"
            @update-player="handlePlayerUpdate"
            @score-change="handleScoreChange"
          />
        </div>
      </div>
    </div>
    <div
      v-if="isResetConfirmVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
      @click.self="hideResetConfirm"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white"
      >
        <p class="text-2xl font-bold leading-tight">¿Reiniciar marcador?</p>
        <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
          Esta acción pondrá el tiempo y los puntajes en cero. ¿Seguro que
          quieres continuar?
        </p>
        <div class="mt-6 flex gap-3">
          <button
            type="button"
            class="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/30 dark:text-white/90 dark:hover:bg-white/5"
            @click="hideResetConfirm"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="flex-1 rounded-lg bg-red-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/40"
            @click="confirmReset"
          >
            Sí, reiniciar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
