<template>
    <div class="setting">
        <div class="go-top" v-show="isTop" @click="goTop">
            <i class="iconfont icon-huojian"></i>
        </div>
        <div class="setting-item">
            <div class="setting-icon">
                <i class="iconfont icon-shezhi"></i>
            </div>
            <ul class="setting-form">
                <li v-for="item in themeOptions" :key="item.value" class="setting-theme-item">
                    <input :id="`theme-${item.value}`" type="radio" :value="item.value" v-model="settingForm.theme" @change="applyTheme">
                    <label :for="`theme-${item.value}`">{{item.label}}</label>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref,onMounted,reactive } from "vue";
import { themeConfig } from "@/setting.js";
let isTop = ref(false);
const settingForm = reactive({
    theme: 'default'
});
const showSettingForm = ref(true);
let htmlStyle = null;
let root = null;
let rootCss = ref({});

const themeOptions = [
    {
        value: 'default',
        label: '默认'
    },
    {
        value: 'purple',
        label: '粉紫色'
    }
];

function goTop(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
function applyTheme(e){
    Object.assign(rootCss.value, themeConfig[settingForm.theme]);
    // 应用到根元素
    Object.entries(rootCss.value).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

onMounted(()=>{
    root = document.documentElement;
    htmlStyle = getComputedStyle(root);
    rootCss.value = {
        '--primary-color': htmlStyle.getPropertyValue('--primary-color'),
        '--primary-light': htmlStyle.getPropertyValue('--primary-light'),
        '--secondary-color': htmlStyle.getPropertyValue('--secondary-color'),
        '--accent-color': htmlStyle.getPropertyValue('--accent-color'),
        '--text-color': htmlStyle.getPropertyValue('--text-color'),
        '--text-light': htmlStyle.getPropertyValue('--text-light'),
        '--bg-color': htmlStyle.getPropertyValue('--bg-color'),
        '--card-bg': htmlStyle.getPropertyValue('--card-bg'),
        '--border-color': htmlStyle.getPropertyValue('--border-color'),   
    };
    // 监听滚动
    window.addEventListener('scroll',(e)=>{
        if(window.scrollY > 200){
            isTop.value = true;
        }else{
            isTop.value = false;
        }
    });
})
</script>
<style lang="scss" scoped>
.setting{
    position: fixed;
    bottom: 3rem;
    right: 1.5rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    // box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
}
.go-top{
    font-size: 1.5rem;
    line-height: 1;
    background-color: rgba(255, 255, 255, 0.68);
    border-radius: 50%;
    padding: 0.5rem;
    cursor: pointer;
    &:hover{
        animation: rotate 0.8s infinite linear alternate;
    }
    .iconfont{
        font-size: 1.6rem;
    }
}
.setting-icon{
    position: relative;
    font-size: 1.5rem;
    line-height: 1;
    background-color: rgba(255, 255, 255, 0.68);
    border-radius: 50%;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover{
        transform: scale(1.1) rotate(180deg);
    }

    .iconfont{
        font-size: 1.6rem;
    }
}
.setting-item{
    position: relative;
    &:hover .setting-form{
        display: flex;
        flex-direction: column;
        row-gap: 0.3rem;
    }
}
form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    .setting-form-item{
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
}
.setting-form{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 51px;
    background-color:#fff;
    border-radius: 0.5rem;
    padding: 0.5rem;
    display: none;
    box-shadow: var(--box-shadow);
    &::after{
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -7px;
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 12px solid var(--bg-color);
    }
}
.setting-theme-item{
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100px;
    border: 1px solid var(--border-color);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    input{
        cursor: pointer;
    }
    label{
        font-size: 0.95rem;
        cursor: pointer;
    }
    &:hover{
        transform: scale(1.05);
    }
}
@keyframes rotate {
    from {
        --translateY: 0px;
        transform: scale(1) translateY(0px);
    }
    to {
        --translateY: 10px;
        transform: scale(1) translateY(10px);
    }
}
</style>