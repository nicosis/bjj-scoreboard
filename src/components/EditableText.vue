<script setup>
import { nextTick, ref, watch } from "vue";

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
});

const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);
const isEditing = ref(false);
const inputRef = ref(null);

watch(
  () => props.modelValue,
  (value) => {
    if (!isEditing.value) {
      localValue.value = value ?? "";
    }
  }
);

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
  emit("update:modelValue", localValue.value.trim());
};

const handleKeydown = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    finishEditing();
  }
  if (event.key === "Escape") {
    isEditing.value = false;
    localValue.value = props.modelValue;
  }
};
</script>

<template>
  <component
    :is="tag"
    v-if="!isEditing"
    type="button"
    class="cursor-text"
    :class="displayClass"
    @click="startEditing"
  >
    {{ modelValue || placeholder }}
  </component>
  <input
    v-else
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
</template>
