<template>
  <view class="login-container">
    <!-- 顶部 Logo -->
    <view class="logo-section">
      <image class="logo" src="@/static/login/logo.png" mode="aspectFill"></image>
      <text class="app-name">音乐</text>
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
        <uni-icons type="eye" size="26" color="#ff758c" class="icon"></uni-icons>
        <input 
          class="input" 
          v-model="form.password" 
          type="password" 
          placeholder="请输入密码" 
          maxlength="20"
        />
      </view>
      <!-- 验证码输入框 + 图片 -->
      <view class="form-item">
        <uni-icons type="info" size="26" color="#ff758c" class="icon"></uni-icons>
        <input 
          class="input" 
          v-model="form.captcha" 
          placeholder="请输入验证码" 
          maxlength="6"
        />
        <image 
          :src="captchaInfo.image" 
          class="captcha-img" 
          mode="aspectFill" 
          @click="getCode"
        ></image>
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
import { onLoad } from '@dcloudio/uni-app'
import { setStore } from '@/util/store.js'

const form = ref({
  username: '',
  password: '',
  captcha: '' // 新增验证码输入
})

// 验证码信息
const captchaInfo = ref({
  key: "",
  image: "",
})
// 登录逻辑
const login = () => {
  if (!form.value.username || !form.value.password || !form.value.captcha) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
// 请求后端注册接口
  let params = {
    username: form.value.username,
    password: form.value.password,
  }
  let headers = {
	  "Captcha-Key": captchaInfo.value.key,
	  "Captcha-Code": form.value.captcha,
  }

 uni.showLoading({
 	mask: true
 })
  $https("/music-app/login/login","post",params,2,headers).then(res=>{
      uni.showToast({ title: '登录成功', icon: 'success' })
	  
	  setStore({
	  		  name: "tokenInfo",
	  		  content: res.data.data
	  })
	  setStore({
		  name: "accToken",
		  content: res.data.data.accToken
	  })
	  setStore({
		  name: "refreshToken",
		  content: res.data.data.refreshToken
	  })
	  uni.reLaunch({
	  	url: "/pages/profile/profile"
	  })
  }).catch((e)=>{
	// uni.showToast({ title: '登录失败', icon: 'none' })
	getCode() // 刷新验证码
  })
  .finally(()=>{
	  uni.hideLoading()
  })
}

// 跳转注册页
const goRegister = () => {
  uni.navigateTo({ url: '/pages/register/register' })
}


onLoad(()=>{
  // 获取验证码
  getCode() 
})

const getCode = ()=> {
  $https("/music-app/login/getCode","get",{},1,{}).then(res => {
    captchaInfo.value.image = res.data.data.image
    captchaInfo.value.key = res.data.data.key
  })
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg,#dfe9f3,#f8f9fa); /* 柔和灰白渐变 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;
  position: relative;
  overflow: hidden;
}

/* 背景光晕（淡灰紫柔光） */
.login-container::before,
.login-container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(160rpx);
  opacity: 0.25;
}
.login-container::before {
  width: 500rpx;
  height: 500rpx;
  background: rgba(160, 174, 192, 0.25); /* 灰紫 */
  top: -180rpx;
  left: -120rpx;
}
.login-container::after {
  width: 420rpx;
  height: 420rpx;
  background: rgba(226, 232, 240, 0.25); /* 浅灰蓝 */
  bottom: -140rpx;
  right: -100rpx;
}

/* Logo */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
  z-index: 1;
}
.logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 6rpx solid rgba(255, 255, 255, 0.85);
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
}
.app-name {
  font-size: 38rpx;
  color: #4a5568; /* 深灰蓝文字 */
  font-weight: 600;
  letter-spacing: 3rpx;
}

/* 表单 */
.form-section {
  width: 80%;
  background: #fff;
  border-radius: 28rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.08);
  z-index: 1;
}

/* 输入框 */
.form-item {
  display: flex;
  align-items: center;
  background: #f7fafc; /* 很浅的灰白底色 */
  border-radius: 40rpx;
  padding: 20rpx 26rpx;
  margin-bottom: 36rpx;
  transition: all 0.3s;
}
.form-item:focus-within {
  background: #fff;
  box-shadow: 0 0 0 3rpx rgba(160, 174, 192, 0.3); /* 灰紫高亮 */
}
.icon {
  margin-right: 20rpx;
  color: #718096; /* 柔和灰蓝 */
}
.input {
  flex: 1;
  border: none;
  font-size: 28rpx;
  height: 60rpx;
  background: transparent;
  outline: none;
}

/* 验证码 */
.captcha-img {
  width: 160rpx;
  height: 60rpx;
  margin-left: 20rpx;
  border-radius: 10rpx;
  border: 1rpx solid #e2e8f0; /* 浅灰边框 */
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}
.captcha-img:active {
  transform: scale(0.96);
  opacity: 0.8;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg,#a0aec0,#cbd5e0); /* 柔和灰蓝渐变 */
  border-radius: 40rpx;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 6rpx 16rpx rgba(160, 174, 192, 0.3);
  transition: all 0.25s;
}
.login-btn:active {
  transform: scale(0.97);
  box-shadow: 0 4rpx 12rpx rgba(160, 174, 192, 0.25);
}

/* 底部注册 */
.footer {
  margin-top: 50rpx;
  text-align: center;
  z-index: 1;
}
.footer text {
  color: #4a5568; /* 深灰文字 */
  font-size: 28rpx;
}
.footer text:active {
  opacity: 0.7;
}


</style>
