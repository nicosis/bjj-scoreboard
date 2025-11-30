<script setup>
import { computed } from "vue";
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
  compact: {
    type: Boolean,
    default: false,
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

const headerPaddingClass = computed(() =>
  props.compact ? "px-3 py-2 sm:px-4" : "px-4 py-3 sm:px-6"
);
const leftGapClass = computed(() =>
  props.compact ? "gap-3" : "gap-4"
);
const rightGapClass = computed(() =>
  props.compact ? "gap-4 sm:gap-6" : "gap-6 sm:gap-8"
);
const metaGapClass = computed(() =>
  props.compact ? "gap-4" : "gap-6"
);
const logoSizeClass = computed(() =>
  props.compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-16 w-16 sm:h-20 sm:w-20"
);
const organizerDisplayClass = computed(() =>
  props.compact
    ? "text-left text-base font-bold leading-tight tracking-tight hover:text-primary focus:outline-none"
    : "text-left text-lg font-bold leading-tight tracking-tight hover:text-primary focus:outline-none"
);
const organizerInputClass = computed(() =>
  props.compact ? "text-base font-semibold" : "text-lg font-semibold"
);
const metaDisplayClass = computed(() =>
  props.compact
    ? "text-xs font-medium leading-tight text-gray-600 hover:text-primary dark:text-white/80"
    : "text-sm font-medium leading-normal text-gray-600 hover:text-primary dark:text-white/80"
);
const metaInputClass = computed(() =>
  props.compact ? "text-xs" : "text-sm"
);
</script>

<template>
  <header
    :class="[
      'flex items-center justify-between whitespace-nowrap border-b border-gray-200 text-gray-900 dark:border-white/10 dark:text-white',
      headerPaddingClass,
    ]"
  >
    <div :class="['flex items-center', leftGapClass]">
      <img
        src="/MG-Team-Logo.png"
        alt="Logo"
        :class="['object-contain', logoSizeClass]"
      />
      <EditableText
        :model-value="organizer"
        placeholder="Nombre del evento"
        :display-class="organizerDisplayClass"
        :input-class="organizerInputClass"
        @update:model-value="updateOrganizer"
      />
    </div>
    <div :class="['flex flex-1 items-center justify-end', rightGapClass]">
      <div :class="['hidden items-center sm:flex', metaGapClass]">
        <EditableText
          :model-value="category"
          placeholder="Categoria"
          :display-class="metaDisplayClass"
          :input-class="metaInputClass"
          @update:model-value="updateCategory"
        />
        <EditableText
          :model-value="tatami"
          placeholder="Tatami"
          :display-class="metaDisplayClass"
          :input-class="metaInputClass"
          @update:model-value="updateTatami"
        />
      </div>
    </div>
  </header>
</template>
