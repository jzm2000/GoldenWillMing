<template>
    <div class="comment-bottom-decoration">
        <div class="bottom-decoration">
            <n-input
                ref="commentTextareaRef"
                v-model:value="newComment"
                placeholder="写下你的评论..."
                class="comment-textarea"
                :autosize="{
                    minRows: 2,
                    maxRows: 3,
                }"
                @blur="handleBlur"
                maxlength="300"
                show-count
                type="textarea"
            ></n-input>
            <div class="comment-button-container">
                <div>
                    <EmojiMartVue3 @change="handleEmojiChange">
                        <div style="font-size: 21px;cursor: pointer;">
                            😊
                        </div>
                    </EmojiMartVue3>
                </div>
                <button 
                    class="submit-comment-button"
                    :disabled="!newComment.trim()"
                    @click="submitComment"
                >
                    发表评论
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import EmojiMartVue3 from '@/components/EmojiMartVue3/EmojiMartVue3.vue'
const props = defineProps({
    commentForm: {
        type: Object,
        default: () => ({})
    }
});
const emit = defineEmits(['submitComment']);
const newComment = ref('');
let cursorIndex = ref(0);
let commentTextareaRef = ref(null);
function handleBlur(e){
    cursorIndex.value = e.target.selectionStart;
    console.log(commentTextareaRef.value);
    
};
function submitComment(){
    if (!newComment.value.trim()) return;
    emit('submitComment', {
        ...props.commentForm,
        content: newComment.value
    });
    newComment.value = '';
};
function handleEmojiChange(emoji){
    newComment.value = newComment.value.slice(0,cursorIndex.value) + emoji + newComment.value.slice(cursorIndex.value);
    cursorIndex.value = cursorIndex.value + emoji.length;
    
    setTimeout(()=>{
        commentTextareaRef.value.focus();
        commentTextareaRef.value.textareaElRef.selectionStart = cursorIndex.value;
        commentTextareaRef.value.textareaElRef.selectionEnd = cursorIndex.value;
    },0)
}
console.log(props.commentForm);
</script>
<style scoped lang="scss">
.comment-button-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
}
.submit-comment-button{
    padding:0.5rem 1.5rem;
}
</style>
