<template>
  <div class="j-calendar" :style="wrapStyle">
    <div class="j-calendar-header">
        <slot name="header">
            <div class="j-calendar-header-content">
              <div class="j-calendar-date">
                <select name="year" v-model="selectForm.year" @change="handleChange" class="j-calendar-select">
                      <option v-for="year in yearList" :value="year" :key="year">{{ year }}</option>
                </select>
                <select name="month" v-model="selectForm.month" @change="handleChange" class="j-calendar-select">
                      <option v-for="month in monthList" :value="month" :key="month">{{ month }}</option>
                </select>
              </div>
              <div class="j-calendar-btn">
                <div class="j-calendar-today" @click="handleClickToday">今天</div>
              </div>
            </div>
        </slot>
    </div>
    <div class="j-calendar-body">
      <div class="j-calendar-week">
        <div class="j-calendar-week-item" v-for="item in weekList" :key="item">
          {{ item }}
        </div>
      </div>
      <div class="j-calendar-day" :style="{'gap':addUnit(gap)}">
        <div 
          :class="['j-calendar-day-item',{'not-current-month':!item.isCurrentMonth,'is-today':item.isToday,'is-selected':item.isSelected}]" 
          v-for="item in dayList" 
          :key="item.fullDate"
          @click="handleClick(item)"
          >
          <slot name="item" :item="item">
            {{ item.day }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,computed, reactive } from 'vue'
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    width:{
        type:[String,Number],
        default:"100%"
    },
    gap:{
        type:[String,Number],
        default:"0"
    },
    borderColor:{
        type:String,
        default:"transparent"
    }
});
const emit = defineEmits(['update:modelValue','change']);

const wrapStyle = computed(()=>{
  const style = {};
  if(props.width) style.width = addUnit(props.width);
  return [style]
})

let selectDate = reactive({});
let selectForm = reactive({
    year: '',
    month: '',
});
let dayList = ref([]);
let yearList = ref([]);
let weekList = ref([
  '周日',
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
]);
let monthList = ref([1,2,3,4,5,6,7,8,9,10,11,12]);
let y = new Date();
let nowY = y.getFullYear();
let nowM = y.getMonth() + 1;
let nowD = y.getDate();

yearList.value = [...[4,3,2,1].map(i => nowY + i),...[0,1,2,3,4,5].map(i => nowY- i)]
setDateList();

function setDateList(date=Date.now()){
    dayList.value = [];
    let _date = new Date(date);
    let _year = _date.getFullYear();
    let _month = _date.getMonth() + 1;
    let _day = _date.getDate();
    let _week = _date.getDay();

    selectForm.year = _year;
    selectForm.month = _month;
    // 获取当前月有多少天
    let lastDay = new Date(_year, _month, 0).getDate();
    // 计算上个月有多少天
    let lastMonthDay = new Date(_year, _month - 1, 0).getDate();
    // 计算下个月有多少天
    let nextMonthDay = new Date(_year, _month + 1, 0).getDate();
    // 计算当前月1号是周几
    let firstWeek = new Date(_year, _month - 1, 1).getDay();
    // 计算要显示下个月的天数
    let nextMonthDayCount = 42 - lastDay - firstWeek;

    for(let i = 1; i<= lastDay;i++){
        dayList.value.push({
            day:i,
            fullDate:`${_year}-${_month < 10 ? '0' + _month : _month}-${i < 10 ? '0' + i : i}`,
            shortDate:`${_month < 10 ? '0' + _month : _month}-${i < 10 ? '0' + i : i}`,
            isCurrentMonth: true,
            isToday: i === nowD && _month === nowM && _year === nowY,
            isSelected: getDateTime(props.modelValue) === getDateTime(_year + '-' + _month + '-' + i),
        });
    };
    for(let i = 0; i< firstWeek;i++){
        dayList.value.unshift({
            day:lastMonthDay - i,
            fullDate:`${_year}-${_month - 1 < 10 ? '0' + (_month - 1) : _month - 1}-${lastMonthDay - i < 10 ? '0' + (lastMonthDay - i) : lastMonthDay - i}`,
            shortDate:`${_month - 1 < 10 ? '0' + (_month - 1) : _month - 1}-${lastMonthDay - i < 10 ? '0' + (lastMonthDay - i) : lastMonthDay - i}`,
            isCurrentMonth: false,
            isToday: false,
            isSelected: getDateTime(props.modelValue) === getDateTime(_year + '-' + (_month - 1) + '-' + (lastMonthDay - i)),
        });
    };
    for(let i = 1; i<= nextMonthDayCount;i++){
        dayList.value.push({
            day:i,
            fullDate:`${_year}-${_month + 1 < 10 ? '0' + (_month + 1) : _month + 1}-${i < 10 ? '0' + i : i}`,
            shortDate:`${_month + 1 < 10 ? '0' + (_month + 1) : _month + 1}-${i < 10 ? '0' + i : i}`,
            isCurrentMonth: false,
            isToday: false,
            isSelected: getDateTime(props.modelValue) === getDateTime(_year + '-' + (_month + 1) + '-' + i),
        });
    };
};
function handleChange(){
    if(selectForm.year && selectForm.month){
        setDateList(`${selectForm.year}-${selectForm.month}-01`);
    }
}
function handleClickToday(){
  setDateList();
  let selectObj = dayList.value.find(item => item.isToday);
  if(selectObj){
    handleClick(selectObj);
  };
  selectForm.year = selectObj.fullDate.split('-')[0];
  selectForm.month = selectObj.fullDate.split('-')[1];
};
function handleClick(item){
    dayList.value.forEach((item) => {
        item.isSelected = false;
    });
    item.isSelected = true;
    // date.value = item.fullDate;
    Object.assign(selectDate,item);
    emit('update:modelValue',selectDate.fullDate);
    emit("change",JSON.parse(JSON.stringify(item)));
};
function setDate(date){
  setDateList(date);
};
function getDateTime(date){
  if(!date) return '';
  let _date = new Date(date);
  let _year = _date.getFullYear();
  let _month = _date.getMonth() + 1;
  let _day = _date.getDate();
  return `${_year}-${_month < 10 ? '0' + _month : _month}-${_day < 10 ? '0' + _day : _day}`;
};
function addUnit(value){
  if(typeof value === 'number') return `${value}px`;
  return value;
}

defineExpose({
  setDate
})
</script>

<style scoped lang="scss">
.j-calendar {
  min-width: 300px;
  border: 1px solid #ccc;
  padding: 8px;
  box-sizing: border-box;
}
.j-calendar-header {
  padding: 10px 0;
}

.j-calendar-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  
  .j-calendar-select {
    padding: 6px 12px 6px 0;
    border: 1px solid #d0d5dd;
    border-radius: 6px;
    background-color: #ffffff;
    color: #344054;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-width: 80px;
    text-align: center;
    
    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 1px 2px 0 rgba(59, 130, 246, 0.05);
    }
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &:active {
      transform: translateY(0.5px);
    }
  }
  .j-calendar-select:nth-child(2) {
    margin-left: 10px;
  }
.j-calendar-week {
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.j-calendar-week-item {
  text-align: center;
  width: calc(100% / 7);

}
.j-calendar-date{
  display: flex;
  flex-wrap: wrap;
}
.j-calendar-day{
    // display: flex;
    // flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    margin-top: 4px;
    gap: 4px;
}
.j-calendar-today{
  text-align: center;
  height: 30px;
  line-height: 30px;
  border: 1px solid #dcdee0;
  background-color: #fff;
  padding: 0 10px;
  cursor: pointer;
  &:hover{
      background-color: #eaecf2;
  }
}
.j-calendar-day-item {
    text-align: center;
    // width: calc(100% / 7);
    // min-height: 30px;
    // line-height: 30px;
    border: 1px solid v-bind('props.borderColor');
    cursor: pointer;
    &:hover{
        background-color: #eaecf2;
    }
}
.j-calendar-day-item.not-current-month {
    color:#a6acb1;
}
.j-calendar-day-item.is-today {
    background-color: #1975c5;
    color: #fff;
}
.j-calendar-day-item.is-selected {
    border: 1px solid #1975c5;
    background-color: #ecf5ff;
    color: #1975c5;
}
</style>