<template>
  <view class="collect-container">
    <!-- 顶部 tab 切换 -->
    <view class="tab-section">
      <view 
        v-for="(item, index) in platforms" 
        :key="index" 
        class="tab-item" 
        :class="{ active: currentTab === item.value }"
        @click="switchTab(item.value)"
      >
        {{ item.label }}
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-box">
      <input 
        class="search-input"
        v-model="keywords"
        placeholder="输入歌曲 / 歌手名"
        confirm-type="search"
        @confirm="searchMusic"
      />
      <button class="search-btn" @click="searchMusic">搜索</button>
    </view>

    <!-- 动画列表 -->
    <uni-transition :mode-class="['fade']" :show="showList" class="list-section">
      <view>
        <view 
          v-for="(song, index) in musicList" 
          :key="index" 
          class="song-card"
        >
          <image class="cover" :src="song.image" mode="aspectFill"></image>
          <view class="song-info">
            <text class="song-title">{{ song.musicName }}</text>
            <text class="song-singer">{{ song.singerName }}</text>
          </view>
          <view class="action-btns">
            <button class="play-btn" @click="playSong(song)">▶ 播放</button>
            <button class="collect-btn" @click="collectSong(song)">＋ 收录</button>
          </view>
        </view>

        <!-- 空数据展示 -->
        <view v-if="musicList.length === 0" class="empty-box">
          <text class="empty-text">暂无歌曲，请尝试搜索或切换平台~</text>
        </view>
      </view>
    </uni-transition>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { onLoad } from '@dcloudio/uni-app'

const platforms = [
  { label: "酷狗", value: "kugou" },
  { label: "QQ", value: "qq" },
  { label: "网易云", value: "netease" }
]

const currentTab = ref("kugou")
const musicList = ref([])
const showList = ref(true)
const keywords = ref("") // 搜索关键字

const loadMusic = () => {
	if(keywords){
		return
	}
  let params = {
    platformType: currentTab.value,
    keywords: keywords.value,
    current: 1,
    size: 10
  }
  uni.showLoading({ mask: true })
  $https("/music-app/collect/song","get",params,1,{}).then(res=> {
    musicList.value = res.data.data.data || []
  }).finally(()=>{
    uni.hideLoading()
  })
}

const searchMusic = () => {
  if (!keywords.value.trim()) {
    uni.showToast({ title: "请输入搜索内容", icon: "none" })
    return
  }
  loadMusic()
}

const switchTab = (platform) => {
  if (currentTab.value === platform) return
  showList.value = false
  setTimeout(() => {
    currentTab.value = platform
    loadMusic()
    showList.value = true
  }, 50)
}

const playSong = (song) => {
  uni.navigateTo({
    url: `/pages/musicPlay/musicPlay?url=${song.url}`
  })
}

const collectSong = (song) => {
  uni.showToast({
    title: `已加入队列《${song.musicName}》`,
    icon: "success"
  })
  let params = {
    "musicName": song.musicName || keywords.value,
    "platformType": currentTab.value,
    "musicUrl": song.musicUrl,
    "musicHash": "132456789",
  }
  $https("/music-app/collect/downloadCollect","post",params,2,{}).then( res=> {})
}

onLoad(() => {
  loadMusic()
})
</script>

<style scoped>
.collect-container {
  background: #f9f9f9;
  min-height: 100vh;
  padding: 30rpx;
}

/* tab 区域 */
.tab-section {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: 50rpx;
  margin-bottom: 30rpx;
  padding: 12rpx;
  box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.08);
}
.tab-item {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 14rpx 0;
  border-radius: 40rpx;
  transition: all 0.3s;
}
.tab-item.active {
  font-weight: bold;
  background: #e0e7ff;
  color: #4a4a4a;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.08);
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 40rpx;
  padding: 10rpx 20rpx;
  box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.05);
}
.search-input {
  flex: 1;
  font-size: 28rpx;
  border: none;
  padding: 10rpx;
}
.search-btn {
  background: #e0e7ff;
  color: #4a4a4a;
  font-size: 26rpx;
  padding: 14rpx 28rpx;
  border-radius: 40rpx;
  margin-left: 10rpx;
}

/* 列表样式 */
.list-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.song-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.05);
  transition: transform 0.2s;
}
.song-card:active {
  transform: scale(0.98);
}
.cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  margin-right: 20rpx;
}
.song-info {
  flex: 1;
}
.song-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.song-singer {
  display: block;
  font-size: 26rpx;
  color: #888;
  margin-top: 6rpx;
}
.action-btns {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.play-btn, .collect-btn {
  font-size: 24rpx;
  border-radius: 40rpx;
  padding: 12rpx 24rpx;
  transition: transform 0.2s;
}
.play-btn {
  background: #e0e7ff;
  color: #4a4a4a;
}
.play-btn:active, .collect-btn:active {
  transform: scale(0.9);
}
/* 空数据提示 */
.empty-box {
  text-align: center;
  padding: 80rpx 0;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
}


/* 按钮统一样式 */
button {
  border: none;
  border-radius: 40rpx;
  padding: 14rpx 28rpx;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.08);
  cursor: pointer;
}

/* 主按钮（注册、保存、播放） */
.save-btn,
.play-btn,
.search-btn {
  background: linear-gradient(135deg, #d9e4ff, #aabfff);
  color: #333;
}

/* 次按钮（收录、收藏等） */
.collect-btn {
  background: #fff;
  color: #4a4a4a;
  border: 2rpx solid #ccc;
}

/* 按下效果 */
button:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
}
</style>
