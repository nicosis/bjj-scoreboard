<script setup>
import { computed, reactive, ref } from "vue";
import HeaderBar from "./components/Header.vue";
import Countdown from "./components/Countdown.vue";
import ScoreBoard from "./components/ScoreBoard.vue";
import { useCountdown } from "./composables/useCountdown";

const organizer = ref("BJJ Championship");
const category = ref("Category: Adult / Black Belt");
const tatami = ref("Tatami: 01");
const isDark = ref(true);

const players = reactive([
  {
    id: "left",
    name: "Competitor Name",
    team: "Team / Academy Name",
    points: 0,
    advantages: 0,
    penalties: 0,
  },
  {
    id: "right",
    name: "Competitor Name",
    team: "Team / Academy Name",
    points: 0,
    advantages: 0,
    penalties: 0,
  },
]);

const {
  time,
  isRunning,
  start,
  pause,
  reset,
  addTime,
  subtractTime,
} = useCountdown(6 * 60);

const rootClasses = computed(() => [
  "relative flex h-auto min-h-screen w-full flex-col overflow-hidden font-display",
  "bg-background-light text-gray-900 dark:bg-background-dark dark:text-white",
]);

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
</script>

<template>
  <div :class="[{ dark: isDark }, ...rootClasses]">
    <div class="layout-container flex h-full grow flex-col">
      <div class="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
        <div class="layout-content-container flex max-w-7xl flex-1 flex-col">
          <HeaderBar
            :organizer="organizer"
            :category="category"
            :tatami="tatami"
            :is-dark="isDark"
            @update:organizer="setOrganizer"
            @update:category="setCategory"
            @update:tatami="setTatami"
            @toggle-theme="toggleTheme"
          />

          <Countdown
            :time="time"
            :is-running="isRunning"
            @play="start"
            @pause="pause"
            @reset="reset"
            @add-minute="() => addTime(60)"
            @subtract-minute="() => subtractTime(60)"
            @add-second="() => addTime(10)"
            @subtract-second="() => subtractTime(10)"
          />

          <ScoreBoard
            :players="players"
            @update-player="handlePlayerUpdate"
            @score-change="handleScoreChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
