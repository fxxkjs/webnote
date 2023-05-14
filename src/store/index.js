import Vue from 'vue'
import Vuex from 'vuex'
import { getTopNav, getLeftNav, getContent } from "../http/http"

Vue.use(Vuex)

export default new Vuex.Store({
  state: { // 存数据
    topNav: null,
    leftNav: [],
    topNavType: null,
    leftNavType: null,
    leftNavItemType: null,
    content: `### Welcome to webNote


> 点击右上方和左侧导航栏可以切换分类并浏览预定的内容。
> 注册账号可以自定义分类和上传个人文档。`,

  },
  mutations: { // 操作数据
    SETTOPNAV(state, data) {
      state.topNav = data.data
    },
    SETLEFTNAV(state, data) {
      state.leftNav = data.data
    },

    SETCONTENT(state, data) {
      state.content = data.data
    },
    setTopNavType(state, data = state.topNav[0]) {
      state.topNavType = data
    },
    setleftNavType(state, data) {
      state.leftNavType = data
    },
    setleftNavItemType(state, data) {
      state.leftNavItemType = data
    }
  },
  actions: { // 异步操作数据
    async setTopNav({ commit }) {
      const result = await getTopNav()
      commit("SETTOPNAV", result.data)
    },
    async setLeftNav({ commit }) {
      const result = await getLeftNav(this.state.topNav.includes(this.state.topNavType) ? this.state.topNavType : this.state.topNav[0])
      commit("SETLEFTNAV", result.data)
    },
    async setContent({ commit }) {
      const result = await getContent(this.state.topNavType, this.state.leftNavType, this.state.leftNavItemType)
      commit("SETCONTENT", result.data)
    }

  },
  getters: {// 计算属性
  },
  modules: {// 给指定模块添加自己的state、mutation、action、getters,方便管理
  }
})
