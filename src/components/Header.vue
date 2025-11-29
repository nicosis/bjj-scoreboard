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
      <img
        src="/MG-Team-Logo.png"
        alt="Logo"
        class="h-12 w-12 object-contain"
      />
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
    </div>
  </header>
</template>
