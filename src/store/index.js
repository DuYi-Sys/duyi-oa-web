import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state={
    token:'',
	roles:{},
	depts:{},
	positions:{},
	organizations:{},
	districts:{}
}

let store=new Vuex.Store({
	state,
	actions,
	mutations,
})
export default store