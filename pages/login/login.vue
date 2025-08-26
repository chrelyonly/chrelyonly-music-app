<template>
  <view class="login-container">
    <!-- 顶部 Logo -->
    <view class="logo-section">
      <image class="logo" src="https://q1.qlogo.cn/g?b=qq&nk=123456&s=640" mode="aspectFill"></image>
      <text class="app-name">音乐小程序</text>
    </view>

    <!-- 登录表单 -->
    <view class="form-section">
      <view class="form-item">
        <uni-icons type="person" size="26" color="#ff758c" class="icon"></uni-icons>
        <input 
          class="input" 
          v-model="form.username" 
          placeholder="请输入手机号或用户名" 
          maxlength="30"
        />
      </view>

      <view class="form-item">
        <uni-icons type="unlock" size="26" color="#ff758c" class="icon"></uni-icons>
        <input 
          class="input" 
          v-model="form.password" 
          type="password" 
          placeholder="请输入密码" 
          maxlength="20"
        />
      </view>

      <button class="login-btn" @click="login">登录</button>
    </view>

    <!-- 底部注册 -->
    <view class="footer">
      <text @click="goRegister">没有账号？注册</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"

const form = ref({
  username: '',
  password: ''
})

// 登录逻辑
const login = () => {
  if (!form.value.username || !form.value.password) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  uni.showToast({ title: '登录成功', icon: 'success' })
  // 这里可调用后端登录 API
}

// 跳转注册页
const goRegister = () => {
  uni.navigateTo({ url: '/pages/register/register' })
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg,#ff758c,#ff7eb3);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;
}

/* Logo */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}
.logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
  margin-bottom: 20rpx;
}
.app-name {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

/* 表单 */
.form-section {
  width: 80%;
  background: #fff;
  border-radius: 30rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.12);
}
.form-item {
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #eee;
  margin-bottom: 40rpx;
  padding-bottom: 10rpx;
}
.icon {
  margin-right: 20rpx;
}
.input {
  flex: 1;
  border: none;
  font-size: 28rpx;
  height: 60rpx;
}
.login-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg,#ff758c,#ff7eb3);
  border-radius: 40rpx;
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  box-shadow: 0 6rpx 18rpx rgba(255,118,148,0.4);
}

/* 底部注册 */
.footer {
  margin-top: 40rpx;
}
.footer text {
  color: #fff;
  font-size: 26rpx;
}
</style>
