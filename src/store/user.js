import { defineStore} from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo:{},
    token:""
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    setToken(token) {
      this.token = token
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      storage: window.sessionStorage
    }]
  }
});