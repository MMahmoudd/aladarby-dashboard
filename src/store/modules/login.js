import axios from 'axios'
import { API_URL } from '../../config'
import router from '../../router/router'
const Login = {
  state: {
    isLoading: false,
    loginErrorMessage: null,
    loginSuccessful: false,
    userData: {},

  },
  mutations: {
    resetState (state) {
      state.isLoading = true
      state.loginErrorMessage = null
      state.loginSuccessful = false
    },
    // Logout
    logout () {
      localStorage.removeItem('token')
      router.push('/login')
    },
  },
  actions: {
    doLogin ({ commit, state, dispatch }, loginData) {
      // console.log(loginData)
      commit('resetState')
      const userData = {
        mobile: loginData.mobile.replace(/\s+/g, ''),
        password: loginData.password,
      }
      // console.log(userData)

      axios.post(`${API_URL}/auth/login`, userData)
        .then((response) => {
          state.isLoading = true
          // console.log(response)

          if (response.data.statusCode === 201) {
            // console.log(response.data.data)
            localStorage.setItem('token', response.data.data.token)
            localStorage.setItem('user', response.data.data.userData)
            dispatch('checkUserData')
            window.location.href = process.env.BASE_URL
          } else {
            state.loginErrorMessage = response.data.error[0]
            state.isLoading = true
          }
        })
        .catch(error => {
          console.log(error)
          state.loginErrorMessage = error.response.data.error[0]
          state.isLoading = true
        })
    },
  },
  getters: {},
}

export default Login
