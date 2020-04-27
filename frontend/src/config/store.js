//Área de amazenamento para 
//compartilhar entre os componentes
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//Criando as funções que vão manipular os dados
export default new Vuex.Store({
    state: {
        isMenuVisible: false,
        user: null
    },
    // 'user' como objeto fixo. Posteriormente esse user será substituido por um usuário que realmente fez login na aplicação
    //É reponsável por fazer a alternancia dos estados do Menu
    mutations: {
        toggleMenu(state, isVisible) {
            if(!state.user) {
                state.isMenuVisible = false
                return
            }

            if(isVisible === undefined) {
                state.isMenuVisible = !state.isMenuVisible
            } else {
                state.isMenuVisible = isVisible
            }
        },
        setUser(state, user) {
            state.user = user
            if(user) {
                axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
                state.isMenuVisible = true
            } else {
                delete axios.defaults.headers.common['Authorization']
                state.isMenuVisible = false
            }
        }
    }
})
