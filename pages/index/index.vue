<template>
  <view class="content">
    <uni-search-bar 
      v-model="searchValue" 
      @confirm="searchFunc" 
      cancelButton="none" 
      placeholder="输入关键词"
      background="#f7fafc"
      border="#e2e8f0"
      placeholderColor="#a0aec0"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchValue: ''
    }
  },
  methods: {
    searchFunc(e) {
      if (e.value) {
        uni.navigateTo({
          url: '/pages/searchResult/searchResult?searchText=' + e.value
        })
      }
    }
  }
}
</script>

<style scoped>
.content {
  background: linear-gradient(135deg,#dfe9f3,#f8f9fa); /* 页面柔和灰白背景 */
  min-height: 100vh;
  padding: 30rpx;
}

/* 搜索框美化 */
.uni-search-bar {
  border-radius: 20rpx;
  height: 70rpx;
  box-shadow: 0 6rpx 16rpx rgba(160, 174, 192, 0.2);
}
.uni-search-bar input {
  font-size: 28rpx;
  color: #4a5568;
}
</style>
