import { createStore } from 'vuex'
import users from './modules/users.js'
import members from './modules/members.js'
import dashboard from './modules/dashboard.js'
import goods from './modules/goods.js'
import iou from './modules/iou.js'

export default createStore({
  state: {
    scrolling: false,
    loadingScreen: false,
    loadingArea: false,
    loginFormModel: false,
    aboutModel: false
  },
  mutations: {
    triggerScrolling(state, status) {
      state.scrolling = status;
    },
    triggerLoadingScreen(state, status) {
      state.loadingScreen = status;
    },
    triggerLoadingArea(state, status) {
      state.loadingArea = status;
    },
    triggerLoginFormModel(state, status) {
      state.loginFormModel = status;
    }
  },
  modules: {
    user: users,
    member: members,
    goods: goods,
    iou: iou,
    app: dashboard
  }
})
