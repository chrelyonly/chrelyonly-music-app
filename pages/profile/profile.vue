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
    <view class="feature-grid" @click="defaultFunc">
      <view class="feature-item" v-for="item in features" :key="item.text">
        <view class="feature-icon" :style="{ background: item.bg }">
          <uni-icons :type="item.icon" size="22" color="#fff"></uni-icons>
        </view>
        <text class="feature-text">{{ item.text }}</text>
      </view>
    </view>

    <!-- 我的歌单 -->
    <view class="playlist-section" @click="defaultFunc">
      <view class="section-header">
        <text class="section-title">🎶 我的歌单</text>
        <uni-icons type="arrow-right" size="20" color="#fff"></uni-icons>
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
import { ref } from "vue";
import { onShow } from '@dcloudio/uni-app';
import { setStore } from "@/util/store.js";

const features = ref([
  { text: "收藏", icon: "star", bg: "linear-gradient(135deg,#ff9a9e,#fad0c4)" },
  { text: "关注", icon: "personadd", bg: "linear-gradient(135deg,#a18cd1,#fbc2eb)" },
  { text: "粉丝", icon: "person", bg: "linear-gradient(135deg,#84fab0,#8fd3f4)" },
  { text: "历史", icon: "time", bg: "linear-gradient(135deg,#fccb90,#d57eeb)" },
  { text: "下载", icon: "download", bg: "linear-gradient(135deg,#fda085,#f6d365)" },
  { text: "本地", icon: "folder", bg: "linear-gradient(135deg,#43e97b,#38f9d7)" },
  { text: "排行榜", icon: "trophy", bg: "linear-gradient(135deg,#30cfd0,#330867)" },
  { text: "电台", icon: "mic", bg: "linear-gradient(135deg,#667eea,#764ba2)" }
]);

const playlists = ref([
  { name: "我喜欢的音乐", count: 20, cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002J5mij1Z3m9h.jpg" },
  { name: "安静学习", count: 15, cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000004V7z9J0XwJ2T.jpg" },
  { name: "跑步必备", count: 30, cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003DFRzY2ZnT8r.jpg" },
  { name: "深夜放松", count: 12, cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000000hn4Ki0P8R9x.jpg" }
]);

const userInfo = ref({}); // 你的原本请求逻辑会填充这个

const goProfileEdit = () => {
  uni.navigateTo({ url: "/pages/profile/profileEdit" });
};

const goLoginEdit = () => {
  uni.navigateTo({ url: "/pages/login/login" });
};

const defaultFunc = () => {
  uni.showToast({ title: "未来可期" });
};

// 保留你的原本请求逻辑
onShow(() => {
  loadUserInfo();
});

const loadUserInfo = () => {
  let params = {};
  $https("/music-app/user/getProfile","get",params,1,{}).then( res=> {
    userInfo.value = res.data.data
    setStore({
      name: "userInfo",
      content: res.data.data
    })
  }).catch((e)=>{
    uni.showToast({ title: '登录后体验更多功能', icon: "none" });
    uni.navigateTo({ url: "/pages/login/login" });
  })
};
</script>

<style scoped>
.profile-container {
  background: linear-gradient(135deg, 
    #fdfbfb, 
    #ebedee, 
    #dbe6f6, 
    #cfd9df, 
    #e0c3fc, 
    #f9f9f9
  );
  background-size: 200% 200%;
  animation: gradientAnimation 18s ease infinite;
  height: 100vh;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.header-bg {
  background: transparent;
}





.settings {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
}
.login {
  position: absolute;
  right: 80rpx;
  top: 20rpx;
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
  border: 4rpx solid rgba(255,255,255,0.5);
  margin-bottom: 20rpx;
}
.nickname {
  font-size: 36rpx;
  font-weight: bold;
}
.signature {
  font-size: 26rpx;
  margin-top: 6rpx;
}

/* 功能入口宫格 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  margin: 20rpx 0;
  gap: 20rpx;
}
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.feature-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  background: rgba(255,255,255,0.2); /* 半透明图标底色 */
}
.feature-text {
  font-size: 24rpx;
}

/* 歌单列表 */
.playlist-section {
  margin-top: 30rpx;
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
}
.playlist-count {
  font-size: 24rpx;
}
</style>
