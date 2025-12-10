<template>
    <div>
        <JImageUpload v-model="imageUrl" @change="handleChange" :httpRequest="httpRequest" multiple>

        </JImageUpload>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import JImageUpload from '@/components/JImageUpload/JImageUpload.vue'
let imageUrl = ref([]);

function handleChange(fileList){
  console.log(fileList);
};

function httpRequest(file){
  console.log(file);
}
</script>
<style lang="scss" scoped>

</style>