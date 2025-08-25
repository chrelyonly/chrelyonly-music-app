<template>
	<view class="content">
		<uni-search-bar @confirm="searchFunc" cancelButton="none" placeholder="输入关键词" v-model="searchValue">
		</uni-search-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchValue: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			searchFunc(e) {
				if (e.value) {
					uni.navigateTo({
						url: '/pages/searchResult/searchResult?searchText=' + e.value
					})
				} else {

				}
			}
		}
	}
</script>

<style>
</style>