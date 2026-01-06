<template>
    <div class="emoji-picker-container" ref="emojiPickerContainerRef">
        <div @click="togglePicker" ref="emojiPickerTriggerRef">
            <slot name="default"></slot>
        </div>
        <div ref="emojiPickerRef" class="emoji-picker" v-show="showPicker"></div>
    </div>
</template>
<script setup>
import { onMounted,ref,onUnmounted,defineEmits,defineProps, nextTick } from 'vue';
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

const emit = defineEmits(['change']);
const emojiPickerRef = ref(null);
const emojiPickerContainerRef = ref(null);
const emojiPickerTriggerRef = ref(null);
const showPicker = ref(false);
const togglePicker = (e) => {
    const { left } = emojiPickerTriggerRef.value.getBoundingClientRect();
    showPicker.value = !showPicker.value;
    nextTick(()=>{
        if(showPicker.value){
            if(e.clientX + emojiPickerRef.value.offsetWidth > window.innerWidth){
                emojiPickerRef.value.style.left = `-${left - 16}px`
            }
        }
        
    })
};
const handleClickOutside = (e) =>{
    if(emojiPickerContainerRef.value && !emojiPickerContainerRef.value.contains(e.target)){
        showPicker.value = false;
    }
}
let picker = new Picker({
    data,
    onEmojiSelect: (emoji) => {
        emit("change",emoji.native);
    }
});
onMounted(() => {
    emojiPickerRef.value.appendChild(picker);
    document.addEventListener('click',handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener('click',handleClickOutside);
});
</script>
<style scoped lang="scss">
.emoji-picker-container {
    position: relative;
}
.emoji-picker {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    animation: slideDown 0.3s ease-in-out;
};

@keyframes slideDown {
    0% {
        transform: translateY(-10px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>