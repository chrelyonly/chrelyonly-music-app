<template>
	<uni-section title="单曲" type="line">
		<uni-list>
			<view v-for="(item,index) in musicData" :key="index" @click="goDetail(item)">
				<uni-list-item   :title="item.singerName" :note="item.singerName" showArrow
					:thumb="item.image" thumb-size="lg"
					rightText="">
				</uni-list-item>
			</view>
		</uni-list>
	</uni-section>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const searchText = ref("")
	const musicData = ref([])
	const pages = ref({
		current: 1,
		size: 10
	})


	onLoad((option) => {
		console.log(option.searchText);
		searchText.value = option.searchText
		init()
	})
	// 加载数据
	const init = ()=>{
		let params = {
			keywords: searchText.value,
			current: pages.value.current,
			size: pages.value.size,
		}
		$https("/music-app/song/searchMusic","get",params,1,{}).then( res=> {
			musicData.value = res.data.data.records
		})
	}
	// 前往音乐播放
	const goDetail = (item)=> {
		uni.navigateTo({
			url: '/pages/musicPlay/musicPlay?url=' + item.musicUrl,
			success: res => {},
			fail: (e) => {
				console.log(e);
			},
			complete: () => {}
		});
	}
	
</script>

<style>

</style>