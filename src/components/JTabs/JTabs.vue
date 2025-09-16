<template>
    <div class="j-tabs">
        <div class="j-tabs-nav">
            <div class="j-tabs-nav-item" v-for="(item,index) in state.tabs" :key="index">{{item}}</div>
        </div>
    </div>
</template>
<script>
import { ref,reactive, defineComponent } from 'vue'
export default defineComponent({
    name:"JTabs",
    setup() {
      const state = reactive({
        tabs:["全部","日记","文章"]
      })
      return {
        state
      }  
    },
})
</script>
<style lang="scss" scoped>

</style>