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

  </scroll-view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from '@dcloudio/uni-app';
import { setStore } from "@/util/store.js";


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
    #dbe6f6, 
    #cfd9df, 
    #e0c3fc, 
    #f9f9f9
  );
  background-size: 200% 200%;
  animation: gradientAnimation 18s ease infinite;
  min-height: 100vh;
  padding: 40rpx 20rpx;
  box-sizing: border-box;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.header-bg {
  background: linear-gradient(160deg, rgba(0,0,0,0.3), rgba(0,0,0,0));
  border-radius: 30rpx;
  padding: 60rpx 30rpx 40rpx;
  position: relative;
  margin-bottom: 40rpx;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.1);
}

.settings {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
}
.login {
  position: absolute;
  right: 100rpx;
  top: 34rpx;
  font-size: 26rpx;
  font-weight: 500;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  border: 6rpx solid rgba(255,255,255,0.8);
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.15);
}
.nickname {
  font-size: 38rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.3);
}
.signature {
  font-size: 26rpx;
  margin-top: 8rpx;
  color: #f2f2f2;
}

/* 功能入口宫格 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 30rpx 20rpx;
  margin: 40rpx 0;
}
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}
.feature-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  box-shadow: 0 6rpx 12rpx rgba(0,0,0,0.1);
}
.feature-text {
  font-size: 24rpx;
  color: #333;
}

/* 歌单列表 */
.playlist-section {
  margin-top: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.05);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #222;
}
.playlist-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.playlist-card {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border-radius: 16rpx;
  padding: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
}
.playlist-cover {
  width: 140rpx;
  height: 140rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
  object-fit: cover;
}
.playlist-info {
  display: flex;
  flex-direction: column;
}
.playlist-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}
.playlist-count {
  font-size: 24rpx;
  margin-top: 6rpx;
  color: #888;
}
</style>
