import { defineStore } from 'pinia';

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    diaryInfo:{}
  }),
  actions: {
    setDiaryInfo(diaryInfo) {
      this.diaryInfo = diaryInfo;
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      storage: window.sessionStorage
    }]
  }
})
