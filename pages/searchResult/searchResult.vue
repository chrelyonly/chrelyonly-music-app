<template>
  <uni-section title="单曲" type="line">
    <uni-list>
      <!-- 有数据时渲染 -->
      <view v-if="musicData.length > 0">
        <view v-for="(item,index) in musicData" :key="index" @click="goDetail(item)">
          <uni-list-item
            :title="item.singerName"
            :note="item.singerName"
            showArrow
            :thumb="item.image"
            thumb-size="lg"
            rightText=""
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
    musicData.value = res.data.data.records || []
  })
}
// 前往音乐播放
const goDetail = (item)=> {
  uni.navigateTo({
    url: '/pages/musicPlay/musicPlay?url=' + item.musicUrl,
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
.empty-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
}
.empty-text {
  color: #999;
  font-size: 28rpx;
}
.footer-tip {
  margin: 40rpx 0;
  text-align: center;
  color: #ff758c;
  font-size: 28rpx;
}
</style>
