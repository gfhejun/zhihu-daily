import Vue from 'vue'
import FastClick from 'fastclick'
import VuiIcon from 'vui-icon'
import App from './App'
import router from './router/index'
import scrollRecord from 'route-data/scrollRecord'

Vue.use(VuiIcon)

FastClick.attach(document.body)

Vue.filter("zhihuDate", function(text) {
	if (text == undefined || text == '') {
		return '';
	}

	var month = text[4] + text[5] + '月';
	var date = text[6] + text[7] + '日'

	return month + date;
})

//自定义指令
Vue.directive('scroll-record', scrollRecord);

new Vue({
	router,
	render: h => h(App)
}).$mount('#app-box')