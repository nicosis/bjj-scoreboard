<script setup>
import EditableText from "./EditableText.vue";

const props = defineProps({
  organizer: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  tatami: {
    type: String,
    default: "",
  },
  isDark: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "update:organizer",
  "update:category",
  "update:tatami",
  "toggle-theme",
]);

const updateOrganizer = (value) => emit("update:organizer", value);
const updateCategory = (value) => emit("update:category", value);
const updateTatami = (value) => emit("update:tatami", value);
</script>

<template>
  <header
    class="flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-4 py-3 text-gray-900 sm:px-6 dark:border-white/10 dark:text-white"
  >
    <div class="flex items-center gap-4">
      <div class="h-6 w-6 text-primary">
        <svg
          fill="none"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <EditableText
        :model-value="organizer"
        placeholder="Nombre del evento"
        display-class="text-left text-lg font-bold leading-tight tracking-tight hover:text-primary focus:outline-none"
        input-class="text-lg font-semibold"
        @update:model-value="updateOrganizer"
      />
    </div>
    <div class="flex flex-1 items-center justify-end gap-6 sm:gap-8">
      <div class="hidden items-center gap-6 sm:flex">
        <EditableText
          :model-value="category"
          placeholder="Categoria"
          display-class="text-sm font-medium leading-normal text-gray-600 hover:text-primary dark:text-white/80"
          input-class="text-sm"
          @update:model-value="updateCategory"
        />
        <EditableText
          :model-value="tatami"
          placeholder="Tatami"
          display-class="text-sm font-medium leading-normal text-gray-600 hover:text-primary dark:text-white/80"
          input-class="text-sm"
          @update:model-value="updateTatami"
        />
      </div>
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-900 transition hover:bg-gray-100 dark:bg-white/10 dark:text-white"
        @click="$emit('toggle-theme')"
      >
        <span class="text-sm font-semibold uppercase">
          {{ isDark ? "DAY" : "NITE" }}
        </span>
      </button>
    </div>
  </header>
</template>
