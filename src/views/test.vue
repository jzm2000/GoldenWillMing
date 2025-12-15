<template>
    <div>
        <JImageUpload v-model="imageUrl" imgDomain="https://api.xqrjw.top" @change="handleChange" :httpRequest="httpRequest" multiple>

        </JImageUpload>
        <n-input v-model:value="message" placeholder="请输入消息" style="width:300px;"></n-input>
        <n-button type="primary" @click="sendMessage">发送消息</n-button>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import JImageUpload from '@/components/JImageUpload/JImageUpload.vue'
let imageUrl = ref([{url:'/static/images/1760618009082_1.jpeg'}]);
import { uploadPhoto } from "@/api/index.js";
function handleChange(fileList){
  console.log(fileList);
};
let message = ref('');

function httpRequest(file){
  uploadPhoto(file).then(res => {
    console.log(res);
  })
  console.log(file);
};

let ws = new WebSocket('ws://127.0.0.1:1949');
function sendMessage() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'chat',
      content: message.value
    }));
  } else {
    console.log('连接未打开');
  }
}

ws.onopen = function() {
  console.log('连接成功');
};
ws.onmessage = function(event) {
  console.log('收到服务器消息:', event.data);
};
ws.onerror = function(error) {
  console.log('连接错误:', error);
};
ws.onclose = function() {
  console.log('连接关闭');
};







</script>
<style lang="scss" scoped>

</style>