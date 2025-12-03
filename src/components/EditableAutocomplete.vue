<script setup>
import { computed, nextTick, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Click para editar",
  },
  displayClass: {
    type: String,
    default: "",
  },
  inputClass: {
    type: String,
    default: "",
  },
  tag: {
    type: String,
    default: "button",
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionLabelKey: {
    type: String,
    default: "label",
  },
  optionDescriptionKey: {
    type: String,
    default: "",
  },
  minChars: {
    type: Number,
    default: 1,
  },
  maxSuggestions: {
    type: Number,
    default: 6,
  },
  dropdownClass: {
    type: String,
    default: "text-sm",
  },
  optionLabelClass: {
    type: String,
    default: "text-base font-semibold",
  },
  optionDescriptionClass: {
    type: String,
    default:
      "text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400",
  },
});

const emit = defineEmits(["update:modelValue", "option-selected"]);

const localValue = ref(props.modelValue ?? "");
const isEditing = ref(false);
const inputRef = ref(null);
const highlightedIndex = ref(-1);

watch(
  () => props.modelValue,
  (value) => {
    if (!isEditing.value) {
      localValue.value = value ?? "";
    }
  }
);

const isPlaceholderActive = computed(
  () => (props.modelValue ?? "").trim().length === 0
);

const displayText = computed(() =>
  isPlaceholderActive.value ? props.placeholder : props.modelValue
);

const normalizedOptions = computed(() => props.options ?? []);

const suggestionFilter = computed(() => localValue.value.trim().toLowerCase());

const filteredOptions = computed(() => {
  if (!isEditing.value || normalizedOptions.value.length === 0) {
    return [];
  }
  const query = suggestionFilter.value;
  if (query.length < props.minChars) {
    return [];
  }
  return normalizedOptions.value
    .filter((item) => getOptionLabel(item).toLowerCase().includes(query))
    .slice(0, props.maxSuggestions);
});

const hasSuggestions = computed(() => filteredOptions.value.length > 0);

watch(filteredOptions, (options) => {
  if (options.length === 0) {
    highlightedIndex.value = -1;
    return;
  }
  if (highlightedIndex.value >= options.length) {
    highlightedIndex.value = 0;
  }
});

const startEditing = () => {
  isEditing.value = true;
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
      inputRef.value.select();
    }
  });
};

const finishEditing = () => {
  isEditing.value = false;
  highlightedIndex.value = -1;
  const value = localValue.value.trim();
  emit("update:modelValue", value);
};

const getOptionLabel = (option) => {
  if (option == null) {
    return "";
  }
  if (typeof option === "string") {
    return option;
  }
  const key = props.optionLabelKey;
  return (option?.[key] ?? "").toString();
};

const getOptionDescription = (option) => {
  if (!props.optionDescriptionKey) {
    return "";
  }
  if (option == null || typeof option === "string") {
    return "";
  }
  const key = props.optionDescriptionKey;
  if (!key) {
    return "";
  }
  return (option?.[key] ?? "").toString();
};

const selectOption = (option) => {
  const label = getOptionLabel(option);
  localValue.value = label;
  emit("update:modelValue", label);
  emit("option-selected", option);
  isEditing.value = false;
  highlightedIndex.value = -1;
};

const handleKeydown = (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (filteredOptions.value.length === 0) {
      return;
    }
    highlightedIndex.value =
      (highlightedIndex.value + 1) % filteredOptions.value.length;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (filteredOptions.value.length === 0) {
      return;
    }
    highlightedIndex.value =
      (highlightedIndex.value - 1 + filteredOptions.value.length) %
      filteredOptions.value.length;
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (
      highlightedIndex.value >= 0 &&
      highlightedIndex.value < filteredOptions.value.length
    ) {
      selectOption(filteredOptions.value[highlightedIndex.value]);
    } else {
      finishEditing();
    }
  } else if (event.key === "Escape") {
    event.preventDefault();
    isEditing.value = false;
    localValue.value = props.modelValue ?? "";
    highlightedIndex.value = -1;
  }
};
</script>

<template>
  <div class="relative">
    <component
      :is="tag"
      v-if="!isEditing"
      type="button"
      class="cursor-text"
      :class="[
        displayClass,
        isPlaceholderActive ? '!text-gray-400 dark:!text-gray-500' : '',
      ]"
      @click="startEditing"
    >
      {{ displayText }}
    </component>
    <div v-else class="relative">
      <input
        ref="inputRef"
        v-model="localValue"
        type="text"
        :class="[
          'w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-1.5 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40',
          inputClass,
        ]"
        @blur="finishEditing"
        @keydown="handleKeydown"
      />
      <div
        v-if="hasSuggestions"
        :class="[
          'absolute left-0 right-0 z-30 mt-2 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-gray-800',
          dropdownClass,
        ]"
      >
        <button
          v-for="(option, index) in filteredOptions"
          :key="`${getOptionLabel(option)}-${index}`"
          type="button"
          class="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition hover:bg-primary/10 focus:bg-primary/10"
          :class="[
            highlightedIndex === index
              ? 'bg-primary/20 text-primary dark:text-white'
              : 'text-gray-900 dark:text-gray-100',
          ]"
          @mousedown.prevent
          @click="selectOption(option)"
        >
          <span :class="optionLabelClass">
            {{ getOptionLabel(option) }}
          </span>
          <span
            v-if="getOptionDescription(option)"
            :class="optionDescriptionClass"
          >
            {{ getOptionDescription(option) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
