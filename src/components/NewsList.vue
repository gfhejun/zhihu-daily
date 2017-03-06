<template>
	<div class="list">
		<scroller 
		height="93%" 
		lock-x 
		scrollbar-y
		use-pullup
		ref="scroller"
		 @on-pullup-loading="loadData(true)" 
		 :pullup-config="pullupConfig">
			<div>
				<swiper :list="swipeList" :auto="true" :loop="true" :interval="3000"></swiper>
				<div v-for="news in list" class="news">
					<div v-if="news.date" class="date">{{news.date | zhihuDate}}</div>
					<div v-else>
						<div class="title">{{news.title}}</div>
						<div class="image">
							<img :src="news.images[0]">
						</div>
					</div>
				</div>
			</div>
		</scroller>
	</div>
</template>
<script type="text/javascript">
	import config from 'util/config'
	import routeData from 'route-data/routeData'
	import axios from 'axios'
	import is from 'is'

	import { Swiper, Scroller } from 'vux'

	const getPageKey = () => {
		return is.object(history.state) ? history.state.key : location.href
	}

	const getBeforeDate = (dateStr) => {
		var dateTime = new Date(
			'' + dateStr[0] + dateStr[1] + dateStr[2] + dateStr[3], 
			'' + dateStr[4] + dateStr[5],
			'' + dateStr[6] + dateStr[7]).getTime();

		var beforeDate = new Date(dateTime - 86400000);
		var year = beforeDate.getFullYear();
		var month = beforeDate.getMonth();
		var date = beforeDate.getDate();
		if (month < 10){
			month = '0' + month;
		}
		if (date < 10){
			date = '0' + date;
		}

		return year + month + date;
	}

	export default{
		mixins: [routeData],
		components:{
			Swiper,
			Scroller
		},
		routeData() {
			return {
				loading: false, //是否在请求中
				list: [], //列表的数据
				swipeList: [], //轮播列表数据
				disableLoadingMore: true, //是否可以上拉加载更多
				newsListUrl: config.url.host + config.url.latest,
				beforeListUrl: config.url.host + config.url.before,
				currentDate: '',
				pullupConfig:{
					content: '上拉加载更多',
					height: 60,
					autoRefresh: false,
					upContent: '上拉加载更多',
					downContent: '松开刷新',
					loadingContent: '内容加载中...'
				}
			}
		},
		mounted() {
			this.loading = false
		},
		created() {
			if (getPageKey() != this.list.key) { //页面前进
				if (this.page == 1) { //首次访问组件
					this.loadData();
					this.list.key = getPageKey();
				} else {
					Object.assign(this.$data, this.$options.routeData());
					this.$nextTick(() => {
						this.list.key = getPageKey();
						this.loadData();
					})
				}
			} else {
				this.loading = false
			}
		},
		methods: {
			loadData(isBefore) {
				if (this.loading) {
					return;
				}

				this.loading = true;

				var url = this.newsListUrl;
				if (isBefore){
					url = this.beforeListUrl + '/' + getBeforeDate(this.currentDate);
				}else{
					//在新的list里不设置key，就无法恢复到原来的位置
					var tempKey = this.list.key;
					this.list = [];
					this.swipeList = [];
					this.list.key = tempKey;
				}

				axios.get(url)
					.then((response) => {
						this.loading = false;

						if (response.status == 200) {
							var data = response.data;

							if (!isBefore){
								data.top_stories.forEach((item) => this.swipeList.push(
									{
										url: 'javascript:',
										img: item.image,
										title: item.title
									}
								));
							}else{
								this.list.push({'date': this.currentDate});
							}
							
							this.currentDate = data.date;
							
							data.stories.forEach((item) => this.list.push(item));
							
							this.$nextTick(() => {
								this.$refs.scroller.reset();
							});
						}

						this.loading = false;

					}, (response) => {
						this.loading = false;
						console.log('出现问题:' + response);
					})
			}
		}
	}
</script>
<style type="text/css" scoped>
	.list{
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}

	.news{
		border-bottom: 1px solid #ddd;
		width: 100%;
	}

	.news .date{
		text-align: center;
		background-color: #469CE7;
		color: white;
		padding: 10px;
	}

	.news .title{
		padding: 15px 0 15px 10px;
		display: inline-block;
		width: 60%;
		vertical-align: top;
	}

	.news .image{
		padding: 15px 10px 15px 0;
		display: inline-block;
		width: 30%;
		text-align: right;
	}

	.news .image img{
		height: 80px;
		width: 90px;
	}
</style>