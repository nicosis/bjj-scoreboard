import { onUnmounted, ref } from "vue";

export function useCountdown(initialSeconds = 6 * 60) {
  const initialTime = ref(initialSeconds);
  const time = ref(initialSeconds);
  const isRunning = ref(false);
  let intervalId = null;

  const clear = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const tick = () => {
    if (time.value <= 0) {
      pause();
      time.value = 0;
      return;
    }

    time.value = Math.max(0, time.value - 1);

    if (time.value === 0) {
      pause();
    }
  };

  const start = () => {
    if (isRunning.value) {
      return;
    }

    if (time.value <= 0) {
      time.value = initialTime.value;
    }

    isRunning.value = true;
    intervalId = setInterval(tick, 1000);
  };

  const pause = () => {
    if (!isRunning.value) {
      return;
    }

    isRunning.value = false;
    clear();
  };

  const reset = () => {
    pause();
    time.value = initialTime.value;
  };

  const addTime = (seconds) => {
    if (isRunning.value) {
      return;
    }
    time.value = Math.max(0, time.value + seconds);
  };

  const subtractTime = (seconds) => {
    if (isRunning.value) {
      return;
    }
    time.value = Math.max(0, time.value - seconds);
  };

  onUnmounted(() => {
    clear();
  });

  return {
    time,
    initialTime,
    isRunning,
    start,
    pause,
    reset,
    addTime,
    subtractTime,
  };
}
