<script setup>
import { computed } from "vue";
import PlayerPanel from "./PlayerPanel.vue";

const props = defineProps({
  players: {
    type: Array,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-player", "score-change"]);

const updatePlayer = ({ id, field, value }) => {
  emit("update-player", { id, field, value });
};

const sectionGapClass = computed(() =>
  props.compact ? "gap-3 sm:gap-4 md:gap-6" : "gap-4 sm:gap-6 md:gap-8"
);
</script>

<template>
  <section
    :class="[
      'grid flex-1 min-h-0 grid-cols-1 md:grid-cols-2',
      sectionGapClass,
    ]"
  >
    <PlayerPanel
      v-for="(player, index) in players"
      :key="player.id"
      :player="player"
      :variant="index === 0 ? 'left' : 'right'"
      :compact="compact"
      @update-name="(payload) => updatePlayer({ id: payload.id, field: 'name', value: payload.value })"
      @update-team="(payload) => updatePlayer({ id: payload.id, field: 'team', value: payload.value })"
      @score-change="$emit('score-change', $event)"
    />
  </section>
</template>
