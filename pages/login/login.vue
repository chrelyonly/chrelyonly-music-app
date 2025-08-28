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
.captcha-img {
  width: 160rpx;
  height: 60rpx;
  margin-left: 20rpx;
  border-radius: 8rpx;
}
</style>
