<template>
  <div>
    <g-calendar v-model="date"></g-calendar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GCalendar from '@/components/GoldUI/g-calendar/Calendar.vue';
let date = ref('2025-11-27');

</script>

<style>

</style>
