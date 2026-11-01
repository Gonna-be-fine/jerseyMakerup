import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    tokenExpires: localStorage.getItem('tokenExpires') || null,
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {
      id: null,
      email: '',
      nickname: '',
      avatar: '',
      pointsBalance: 0
    }
  }),
  
  persist: true, // 启用持久化

  getters: {
    isLoggedIn: (state) => {
      if (!state.token || !state.tokenExpires) return false;
      // 检查token是否过期
      return state.token && new Date().getTime() < state.tokenExpires;
    },
    displayName: (state) => state.userInfo.nickname || state.userInfo.email || '未登录'
  },

  actions: {
    setToken(token, expiresIn) {
      this.token = token;
      this.tokenExpires = expiresIn;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpires', expiresIn);
    },

    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },

    setPointsBalance(pointsBalance) {
      this.userInfo = {
        ...this.userInfo,
        pointsBalance
      };
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
    },

    logout() {
      this.token = '';
      this.tokenExpires = null;
      this.userInfo = {
        id: null,
        email: '',
        nickname: '',
        avatar: '',
        pointsBalance: 0
      };
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpires');
      localStorage.removeItem('userInfo');
    }
  }
}) 
