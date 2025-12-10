<template>
  <div class="yzb_image_upload">
    <div class="file-upload-container">
      <div class="file-upload-card" id="fileUploadCard" :class="{'disabled':disabled}">
        <input 
          type="file" 
          class="file-input" 
          :accept="accept" 
          :disabled="disabled"
          :multiple="multiple" 
          :class="{'disabled':disabled}"
          @change="handleChange"
        />
        <Plus style="width:32px;height: 32px;" color="#9aa0a9" />
        <div class="file-name" id="fileName"></div>
      </div>
      <ul
        class="upload-list upload-list--picture-card"
        v-show="fileList.length > 0"
      >
        <li
          class="upload-list__item"
          v-for="(item, index) in fileList"
          :key="index"
        >
          <img
            class="upload-list__item-thumbnail"
            :src="imgDomain + item.url"
          />

          <span class="upload-list__item-actions">
            <span
              class="upload-list__item-preview"
              @click="handlePictureCardPreview(imgDomain + item.url)"
              v-if="isPreview"
            >
              <ZoomIn />
            </span>
            <span
              class="upload-list__item-download"
              @click="handleDownload(imgDomain + item.url)"
              v-if="isDownload"
            >
              <Download />
            </span>
            <span
              class="upload-list__item-delete"
              v-if="isRemove"
              @click="handleRemove(index)"
            >
              <Delete />
            </span>
          </span>
        </li>
      </ul>
    </div>
    <!-- 上传提示 -->
    <div class="upload-tip" v-if="showIsTip && !content">
      <slot name="tip">
        请上传
        <template v-if="fileSize">
          大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </template>
        <template v-if="fileType">
          格式为
          <b style="color: #f56c6c">{{ fileType.join("/").toLowerCase() }}</b>
        </template>
        的图片
      </slot>
    </div>
  </div>
</template>

<script>

import { reactive, toRefs, ref, watch } from "vue";
import { Plus, ZoomIn, Download, Delete } from '@element-plus/icons-vue'
export default {
  name: "JImageUpload",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    isPreview: {
      type: Boolean,
      default: true
    },
    isDownload: {
      type: Boolean,
      default: false
    },
    isRemove: {
      type: Boolean,
      default: true
    },
    showIsTip: {
      type: Boolean,
      default: true
    },
    content: {
      type: String,
      default: ""
    },
    fileSize: {
      type: Number,
      default: 2
    },
    fileType: {
      type: Array,
      default: () => ["jpg", "jpeg", "png", "gif", "bmp"]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    accept:{
      type: String,
      default: ""
    },
    multiple:{      
      type: Boolean,      
      default: false    
    },
    imgDomain:{
      type: String,
      default: ''
    },
    action:{
      type: String,
      default: ''
    },
    beforeUpload:{
      type: Function,
      default: null
    },
    httpRequest:{
      type: Function,
      default: null
    },
    limit:{
      type: Number,
      default: 1
    }
  },
  emits: ['change', 'update:modelValue'],
  components: { },
  setup(props, { emit }){    
    const state = reactive({
      fileList: [...props.modelValue]
    });
    
    watch(() => props.modelValue, (newVal) => {
      state.fileList = [...newVal];
    }, { deep: true });

    const methods = {
      handlePictureCardPreview(url){
        
      },
      handleDownload(url){
        // 下载图片逻辑
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      handleRemove(index){
        state.fileList.splice(index, 1);
        emit('change', state.fileList);
        emit('update:modelValue', state.fileList);
      },
      handleChange(e){
        const files = Array.from(e.target.files);
        console.log(files);
        
        files.forEach(async (file) => {
          try {

            const result = props.beforeUpload ? await props.beforeUpload(file) : true;
            
            if (result === false) {

              return;
            }

            if(props.httpRequest){
              props.httpRequest(file);
              return;
            };
            
          } catch (error) {

            console.log('上传被中断:', error);
            return;
          }
        });

        e.target.value = '';
      },
    };
    return {
      ...toRefs(state),
      ...methods,
    };
  }
};
</script>

<style scoped lang="scss">
  .file-upload-container{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .file-upload-card {
    width: 146px;
    height: 146px;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    background-color: #f9fafb;
  }

  .file-upload-card:hover {
    border-color: #409eff;
    background-color: #f0f7ff;
  }

  .file-upload-card input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
  }
  .file-input{
    cursor: pointer;
  }
  .file-input.disabled{
      cursor: not-allowed;
  }

  .file-upload-card:hover .upload-icon {
    color: #409eff;
  }

  .file-name {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    padding: 0 20px;
    font-size: 13px;
    color: #374151;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: none;
  }

  .file-upload-card.has-file {
    border-style: solid;
    background-color: #fff;
  }

  .file-upload-card.has-file .upload-icon,
  .file-upload-card.has-file .upload-tip {
    display: none;
  }

  .file-upload-card.has-file .file-name {
    display: block;
  }

  .file-upload-card.disabled {
    cursor: not-allowed;
    opacity: 0.6;
    border-color: #d1d5db;
    background-color: #f9fafb;
  }

  .upload-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  .upload-list--picture-card {
    flex-direction: row;
  }
  
  .upload-list__item {
    position: relative;
    width: 146px;
    height: 146px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    background-color: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .upload-list__item-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .upload-list__item-actions {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .upload-list__item:hover .upload-list__item-actions {
    opacity: 1;
  }
  
  .upload-list__item-preview,
  .upload-list__item-download,
  .upload-list__item-delete {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: #fff;
    margin: 0 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .upload-tip {
    font-size: 14px;
    color: #606266;
    margin-top: 8px;
  }
</style>
