import { login, logout, getInfo, refreshtoken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from '@/utils/storage'
// import axios from 'axios'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions: [],
  permisaction: [],
  deptId: ''

}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    if (avatar.indexOf('http') !== -1) {
      state.avatar = avatar
    } else {
      state.avatar = process.env.VUE_APP_BASE_API + avatar
    }
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permisaction) => {
    state.permisaction = permisaction
  },
  SET_DEPTID: (state, deptId) => {
    state.deptId = deptId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const res = await login(userInfo)
    // console.log(res)
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(response => {
          const { token } = response
          commit('SET_TOKEN', token)
          setToken(token)

          resolve(response)
        })
        .catch(error => {
          reject(error)
          // console.log(error)
        })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          if (!response || !response.data) {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
          }

          const {
            roles,
            name,
            avatar,
            introduction,
            permissions,
            deptId
          } = response.data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          commit('SET_PERMISSIONS', permissions)
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          commit('SET_DEPTID', deptId)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // ????????????
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          storage.clear()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // ??????token
  refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      refreshtoken({ token: state.token })
        .then(response => {
          const { token } = response
          commit('SET_TOKEN', token)
          setToken(token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
