import Vue from 'vue'
import VueRouter from 'vue-router'
import NewsList from 'components/NewsList'

Vue.use(VueRouter)

export default new VueRouter({
	routes: [{
		path: '/newslist',
		name: 'NewsList',
		component: NewsList
	}, {
		path: '*',
		redirect: '/newslist'
	}]
})