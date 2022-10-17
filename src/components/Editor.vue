<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
import EasyMDE, { Options } from 'easymde'

// 类型，属性，事件
interface EditorProps {
  modelValue?: string;
  options?: Options;
}
interface EditorEvents {
  (type: 'update:modelValue', value: string): void;
  (type: 'change', value: string): void;
  (type: 'blur'): void;
}
const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEvents>()

// 有了模板我们需要一些初始化的数据
const textArea = ref<null | HTMLTextAreaElement>(null)
let easyMDEInstance: EasyMDE | null = null
const innerValue = ref(props.modelValue || '')

onMounted(() => {
  if (textArea.value) {
    // 组装options
    const config: Options = {
      ...(props.options || {}),
      element: textArea.value,
      initialValue: innerValue.value
    }
    easyMDEInstance = new EasyMDE(config)
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        // 拿到当前的值
        const updatedValue = easyMDEInstance.value()
        innerValue.value = updatedValue
        emit('update:modelValue', updatedValue)
        emit('change', updatedValue)
      }
    })
    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) {
        emit('blur')
      }
    })
  }
})

onUnmounted(() => {
  if (easyMDEInstance) {
    easyMDEInstance.cleanup()
  }
  easyMDEInstance = null
})
</script>