<script setup>
import { computed } from "vue";
import EditableAutocomplete from "./EditableAutocomplete.vue";
import EditableText from "./EditableText.vue";
import categories from "../data/categories.json";
console.log("categories:", categories);

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
  narrow: {
    type: Boolean,
    default: false,
  },
  editingLocked: {
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

const typographyPreset = computed(() => {
  if (props.compact) {
    return "compact";
  }
  if (props.narrow) {
    return "narrow";
  }
  return "default";
});

const organizerSizeMap = {
  default: "text-3xl",
  narrow: "text-2xl",
  compact: "text-xl",
};

const metaSizeMap = {
  default: "text-3xl",
  narrow: "text-2xl",
  compact: "text-xl",
};

const headerPaddingClass = computed(() =>
  props.compact ? "px-3 py-2 sm:px-4" : "px-4 py-3 sm:px-6"
);
const headerLayoutClass = computed(() =>
  props.narrow
    ? "flex flex-col items-start gap-3 whitespace-normal"
    : "flex items-center justify-between whitespace-nowrap"
);
const leftGapClass = computed(() => (props.compact ? "gap-3" : "gap-4"));
const rightGapClass = computed(() => {
  if (props.compact) {
    return "gap-4 sm:gap-6";
  }
  if (props.narrow) {
    return "gap-4";
  }
  return "gap-6 sm:gap-8";
});
const rightContainerClass = computed(() =>
  props.narrow
    ? "flex w-full items-center justify-start"
    : "flex flex-1 items-center justify-end"
);
const metaGapClass = computed(() => {
  if (props.compact) {
    return "gap-6";
  }
  if (props.narrow) {
    return "gap-4";
  }
  return "gap-8";
});
const metaContainerFlexClass = computed(() =>
  props.narrow ? "sm:flex-wrap sm:justify-start sm:gap-y-1.5" : ""
);
const logoSizeClass = computed(() =>
  props.compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-16 w-16 sm:h-20 sm:w-20"
);
const organizerDisplayClass = computed(() => {
  const size = organizerSizeMap[typographyPreset.value];
  const leading =
    typographyPreset.value === "compact" ? "leading-tight" : "leading-snug";
  return `text-left ${size} font-bold ${leading} tracking-tight hover:text-primary focus:outline-none`;
});

const organizerInputClass = computed(() => {
  switch (typographyPreset.value) {
    case "compact":
      return "text-xl font-semibold";
    case "narrow":
      return "text-2xl font-semibold";
    default:
      return "text-3xl font-semibold";
  }
});
const metaToneClass =
  "font-medium text-gray-600 hover:text-primary dark:text-white/80";

const metaDisplayClass = computed(() => {
  const size = metaSizeMap[typographyPreset.value];
  const leading =
    typographyPreset.value === "compact" ? "leading-tight" : "leading-normal";
  return `${size} ${leading} ${metaToneClass}`;
});

const categoryDisplayClass = computed(() => {
  const size = metaSizeMap[typographyPreset.value];
  const leading =
    typographyPreset.value === "compact" ? "leading-tight" : "leading-normal";
  return `${size} ${leading} ${metaToneClass}`;
});

const metaInputClass = computed(() => {
  switch (typographyPreset.value) {
    case "compact":
      return "text-lg";
    case "narrow":
      return "text-xl";
    default:
      return "text-2xl";
  }
});

const categoryInputClass = computed(() => {
  switch (typographyPreset.value) {
    case "compact":
      return "text-xl";
    case "narrow":
      return "text-2xl";
    default:
      return "text-3xl";
  }
});

const categoryDropdownClass = computed(() => {
  switch (typographyPreset.value) {
    case "compact":
      return "text-lg";
    case "narrow":
      return "text-xl";
    default:
      return "text-2xl";
  }
});

const categoryOptionLabelClass = computed(() => {
  switch (typographyPreset.value) {
    case "compact":
      return "text-lg font-semibold";
    case "narrow":
      return "text-xl font-semibold";
    default:
      return "text-2xl font-semibold";
  }
});

const categoryOptions = categories ?? [];
</script>

<template>
  <header
    :class="[
      'border-b border-gray-200 text-gray-900 dark:border-white/10 dark:text-white',
      headerPaddingClass,
      headerLayoutClass,
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
        :disabled="editingLocked"
        @update:model-value="updateOrganizer"
      />
    </div>
    <div :class="[rightContainerClass, rightGapClass]">
      <div
        :class="[
          'hidden items-center sm:flex',
          metaGapClass,
          metaContainerFlexClass,
        ]"
      >
        <EditableAutocomplete
          :model-value="category"
          placeholder="Categoria"
          :display-class="categoryDisplayClass"
          :input-class="categoryInputClass"
          :options="categoryOptions"
          :min-chars="1"
          :max-suggestions="categoryOptions.length"
          :dropdown-class="categoryDropdownClass"
          :option-label-class="categoryOptionLabelClass"
          :disabled="editingLocked"
          @update:model-value="updateCategory"
        />
        <EditableText
          :model-value="tatami"
          placeholder="Tatami"
          :display-class="metaDisplayClass"
          :input-class="metaInputClass"
          :disabled="editingLocked"
          @update:model-value="updateTatami"
        />
      </div>
    </div>
  </header>
</template>
