<template>
  <div class="g-input">
    <div :class="['g-input_wrap',{'is-focus':isFocus}]">
      <input
        type="text"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
        v-bind="attrs"
        :class="['g-input__inner']"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch,useAttrs } from 'vue'

const props = defineProps({

});
const attrs = useAttrs();

const emit = defineEmits(['update:modelValue','blur','focus','change'])

let isFocus = ref(false);

function handleInput(e){
    emit('update:modelValue', e.target.value)
};
function handleBlur(e){
    isFocus.value = false;
    emit("blur",e)
}
function handleFocus(e){
    isFocus.value = true;
    emit("focus",e)
}
function handleChange(e){
    emit("change",e.target.value)
};
</script>
<style lang="scss" scoped>
.g-input{
  font-size: var(--font-size-base);
  height: var(--g-component-size-base);
}
.g-input_wrap{
  position: relative;
  padding: 0 0.5rem;
  background: #fff;
  border-radius: 0.25rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  &.is-focus{
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
    transform: translateY(-1px);
  }
}
.g-input__inner{
  width: 100%;
  height: 100%;
  font-size: var(--font-size-sm);
  border-radius: 0.25rem;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  height: var(--g-component-size-base);
  line-height: var(--g-component-size-base);
};
.g-input__inner::placeholder{
    color: #65676c;
}
.g-input--small{
  font-size: var(--font-size-sm);
  height: var(--g-component-size-small);
};
</style>