<template>
  <div>
    <j-calendar v-model="date" ref="calendarRef" @change="handleChange"></j-calendar>
  </div>
</template>

<script setup>
import { ref, onMounted,nextTick } from 'vue';
import JCalendar from '@/components/GoldUI/j-calendar/Calendar.vue';
let date = ref('2025-11-27');
let calendarRef = ref(null);
onMounted(() => {
  nextTick(() => {
    calendarRef.value.setDate('2021-11-04');
  })
});
function handleChange(item){
  console.log(item);
}
</script>

<style>

</style>
