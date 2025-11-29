<script setup>
import PlayerPanel from "./PlayerPanel.vue";

const props = defineProps({
  players: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update-player", "score-change"]);

const updatePlayer = ({ id, field, value }) => {
  emit("update-player", { id, field, value });
};
</script>

<template>
  <section class="grid flex-1 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
    <PlayerPanel
      v-for="(player, index) in players"
      :key="player.id"
      :player="player"
      :variant="index === 0 ? 'left' : 'right'"
      @update-name="(payload) => updatePlayer({ id: payload.id, field: 'name', value: payload.value })"
      @update-team="(payload) => updatePlayer({ id: payload.id, field: 'team', value: payload.value })"
      @score-change="$emit('score-change', $event)"
    />
  </section>
</template>
