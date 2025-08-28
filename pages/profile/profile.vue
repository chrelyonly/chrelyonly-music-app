<template>
  <scroll-view scroll-y class="profile-container">
    <!-- 顶部背景 + 用户信息 -->
    <view class="header-bg">
      <uni-icons type="settings" size="26" color="#fff" class="settings" @click="goProfileEdit"></uni-icons>
      <uni-icons size="20" color="#fff" class="login" @click="goLoginEdit">登录</uni-icons>
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <text class="nickname">{{ userInfo.title }}</text>
        <text class="signature">{{ userInfo.sign }}</text>
      </view>
    </view>

    <!-- 功能入口宫格 -->
    <view class="feature-grid">
      <view class="feature-item" v-for="item in features" :key="item.text">
        <view class="feature-icon" :style="{background:item.bg}">
          <uni-icons :type="item.icon" size="22" color="#fff"></uni-icons>
        </view>
        <text class="feature-text">{{ item.text }}</text>
      </view>
    </view>

    <!-- 我的歌单 -->
    <view class="playlist-section">
      <view class="section-header">
        <text class="section-title">🎶 我的歌单</text>
        <uni-icons type="arrow-right" size="20" color="#999"></uni-icons>
      </view>
      <view class="playlist-list">
        <view class="playlist-card" v-for="(item,index) in playlists" :key="index">
          <image class="playlist-cover" :src="item.cover" mode="aspectFill"></image>
          <view class="playlist-info">
            <text class="playlist-name">{{ item.name }}</text>
            <text class="playlist-count">{{ item.count }} 首</text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from "vue"
import { onLoad,onShow } from '@dcloudio/uni-app'
import { setStore } from '@/util/store.js'

const user = ref({
  avatar: "https://q1.qlogo.cn/g?b=qq&nk=123456&s=640",
  nickname: "音乐小王子",
  signature: "用音乐记录生活 🎵"
})

const features = ref([
  { text: "收藏", icon: "star", bg: "linear-gradient(135deg,#ff9a9e,#fad0c4)" },
  { text: "关注", icon: "personadd", bg: "linear-gradient(135deg,#a18cd1,#fbc2eb)" },
  { text: "粉丝", icon: "person", bg: "linear-gradient(135deg,#84fab0,#8fd3f4)" },
  { text: "历史", icon: "time", bg: "linear-gradient(135deg,#fccb90,#d57eeb)" },
  { text: "下载", icon: "download", bg: "linear-gradient(135deg,#fda085,#f6d365)" },
  { text: "本地", icon: "folder", bg: "linear-gradient(135deg,#43e97b,#38f9d7)" },
  { text: "排行榜", icon: "trophy", bg: "linear-gradient(135deg,#30cfd0,#330867)" },
  { text: "电台", icon: "mic", bg: "linear-gradient(135deg,#667eea,#764ba2)" }
])

const playlists = ref([
  { name: "我喜欢的音乐", count: 20, cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002J5mij1Z3m9h.jpg" },
  { name: "安静学习", count: 15, cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000004V7z9J0XwJ2T.jpg" },
  { name: "跑步必备", count: 30, cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003DFRzY2ZnT8r.jpg" },
  { name: "深夜放松", count: 12, cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000000hn4Ki0P8R9x.jpg" }
])


const goProfileEdit = ()=>{
	uni.navigateTo({
		url: '/pages/profile/profileEdit',
		success: res => {},
		fail: () => {},
		complete: () => {}
	});
}

const goLoginEdit = ()=>{
	uni.navigateTo({
		url: '/pages/login/login',
		success: res => {},
		fail: () => {},
		complete: () => {}
	});
}
//监听页面切换变化
onShow(()=>{
	loadUserInfo()
})

const init = ()=>{
	
}

const userInfo = ref({})
// 获取用户信息
const loadUserInfo = () => {
	let params = {
		
	}
	$https("/music-app/user/getProfile","get",params,1,{}).then( res=> {
		userInfo.value = res.data.data
		setStore({
			name: "userInfo",
			content: res.data.data
		})
	})
}
</script>

<style scoped>
.profile-container {
  background-color: #f9f9f9;
  height: 100vh;
}

/* 顶部背景 */
.header-bg {
  background: linear-gradient(135deg,#ff6a88,#ff99ac);
  padding: 120rpx 40rpx 100rpx;
  text-align: center;
  position: relative;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
}
.settings {
  position: absolute;
  right: 30rpx;
  top: 40rpx;
}
.login {
  position: absolute;
  right: 100rpx;
  top: 40rpx;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 6rpx solid #fff;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.2);
  margin-bottom: 20rpx;
}
.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}
.signature {
  font-size: 26rpx;
  color: #f9f9f9;
  margin-top: 6rpx;
}

/* 功能入口宫格 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  background: #fff;
  margin: -60rpx 30rpx 30rpx;
  border-radius: 30rpx;
  padding: 40rpx 0;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.06);
}
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}
.feature-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}
.feature-text {
  font-size: 24rpx;
  color: #333;
}

/* 歌单列表 */
.playlist-section {
  margin: 10rpx 30rpx 60rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
}
.playlist-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.playlist-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.playlist-cover {
  width: 140rpx;
  height: 140rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
}
.playlist-info {
  display: flex;
  flex-direction: column;
}
.playlist-name {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 6rpx;
}
.playlist-count {
  font-size: 24rpx;
  color: #999;
}
</style>
