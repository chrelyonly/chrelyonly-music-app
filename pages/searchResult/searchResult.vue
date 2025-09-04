<template>
  <uni-section title="单曲" type="line">
    <uni-list>
      <!-- 有数据时渲染 -->
      <view v-if="musicData.length > 0">
        <view v-for="(item,index) in musicData" :key="index" @click="goDetail(item)">
          <uni-list-item
            :title="item.name"
            :note="item.artist"
            showArrow
            :thumb="item.coverUrl"
            thumb-size="lg"
            rightText=""
            class="music-item"
          ></uni-list-item>
        </view>
      </view>

      <!-- 无数据时渲染 -->
      <view v-else class="empty-box">
        <text class="empty-text">暂无相关歌曲</text>
      </view>
    </uni-list>
  </uni-section>

  <!-- 底部提示 -->
  <view class="footer-tip" @click="goSearchMore">
    <text>找不到你想要的资源？点击寻找</text>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const searchText = ref("")
const musicData = ref([])
const pages = ref({
  current: 1,
  size: 10
})

onLoad((option) => {
  searchText.value = option.searchText
  init()
})

// 加载数据
const init = () => {
  let params = {
    keywords: searchText.value,
    current: pages.value.current,
    size: pages.value.size,
  }
  $https("/music-app/song/searchMusic","get",params,1,{}).then(res => {
    musicData.value = res.data.data.records || []
  })
}

// 前往音乐播放
const goDetail = (item) => {
  uni.navigateTo({
    url: '/pages/musicPlay/musicPlay?hash=' + item.hash,
  });
}

// 底部提示点击事件
const goSearchMore = () => {
  uni.navigateTo({
    url: '/pages/musicFind/musicFind'
  })
}
</script>

<style scoped>
/* 页面背景统一 */
uni-section {
  background: linear-gradient(135deg,#dfe9f3,#f8f9fa);
  border-radius: 20rpx;
  margin: 20rpx;
  padding: 20rpx 0;
  box-shadow: 0 6rpx 20rpx rgba(160, 174, 192, 0.15);
}

/* 列表项美化 */
.music-item {
  border-radius: 16rpx;
  margin: 8rpx 16rpx;
  background: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

/* 空状态 */
.empty-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
}
.empty-text {
  color: #718096;
  font-size: 28rpx;
}

/* 底部提示 */
.footer-tip {
  margin: 40rpx 0;
  text-align: center;
  color: #718096;
  font-size: 28rpx;
  cursor: pointer;
}
</style>
