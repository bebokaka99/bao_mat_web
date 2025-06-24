<template>
  <div class="custom-select" ref="selectRef">
    <div class="select-selected" :class="{ open: isOpen }" @click="isOpen = !isOpen">
      {{ selectedLabel }}
      <i class="fas fa-chevron-down select-arrow"></i>
    </div>
    <div class="select-items" v-show="isOpen">
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="select-item"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true, // Ví dụ: [{ value: 'Hoàn thành', label: 'Hoàn thành' }]
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
  placeholder: {
    type: String,
    default: '-- Chọn --',
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const selectRef = ref(null);

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected ? selected.label : props.placeholder;
});

const selectOption = (option) => {
  emit('update:modelValue', option.value);
  isOpen.value = false;
};

const closeOnOutsideClick = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick);
});
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  color: #ffffff;
}

.select-selected {
  padding: 0.7rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid #22c55e;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 5px rgba(34, 197, 94, 0.2);
}

.select-selected.open,
.select-selected:hover {
  border-color: #4ade80;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
}

.select-arrow {
  transition: transform 0.3s ease;
}

.select-selected.open .select-arrow {
  transform: rotate(180deg);
}

.select-items {
  position: absolute;
  background-color: #1f2937;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 99;
  border-radius: 1rem;
  border: 1px solid #4ade80;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.select-item {
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #e5e7eb;
}

.select-item:hover {
  background-color: #22c55e;
  color: #1a1d29;
}
</style>