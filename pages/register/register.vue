<template>
  <view class="register-container">
    <!-- 顶部 Logo -->
    <view class="logo-section">
      <image class="logo" src="@/static/login/logo.png" mode="aspectFill"></image>
      <text class="app-name">音乐</text>
    </view>

    <!-- 注册表单 -->
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

      <view class="form-item">
        <uni-icons type="unlock" size="26" color="#ff758c" class="icon"></uni-icons>
        <input 
          class="input" 
          v-model="form.confirm" 
          type="password" 
          placeholder="确认密码" 
          maxlength="20"
        />
      </view>

      <!-- 验证码输入框 + 图片 -->
      <view class="form-item">
        <uni-icons type="eye" size="26" color="#ff758c" class="icon"></uni-icons>
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

      <button class="register-btn" @click="register">注册</button>
    </view>

    <!-- 底部跳转登录 -->
    <view class="footer">
      <text @click="goLogin">已有账号？登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { onLoad } from '@dcloudio/uni-app'

const form = ref({
  username: '',
  password: '',
  confirm: '',
  captcha: '' // 新增验证码输入
})

// 验证码信息
const captchaInfo = ref({
  key: "",
  image: "",
})

// 注册逻辑
const register = () => {
  if (!form.value.username || !form.value.password || !form.value.confirm || !form.value.captcha) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  if (form.value.password !== form.value.confirm) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
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
  $https("/music-app/login/register","post",params,2,headers).then(res=>{
    if(res.data.code === 200){
      uni.showToast({ title: '注册成功', icon: 'success' })
      uni.reLaunch({
      	url: "/pages/login/login"
      })
    }else{
      uni.showToast({ title: res.data.msg || '注册失败', icon: 'none' })
      getCode() // 刷新验证码
    }
  }).finally(()=>{
	  uni.hideLoading()
  })
}

const goLogin = () => {
  uni.navigateBack()
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
.register-container {
  background: linear-gradient(135deg,#dfe9f3,#f8f9fa); /* 柔和灰白渐变 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;
  position: relative;
  overflow: hidden;
}

/* 背景柔光点缀 */
.register-container::before,
.register-container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(160rpx);
  opacity: 0.25;
}
.register-container::before {
  width: 480rpx;
  height: 480rpx;
  background: rgba(160, 174, 192, 0.25); /* 灰紫 */
  top: -160rpx;
  left: -100rpx;
}
.register-container::after {
  width: 420rpx;
  height: 420rpx;
  background: rgba(226, 232, 240, 0.25); /* 浅灰蓝 */
  bottom: -120rpx;
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

/* 表单容器 */
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
  background: #f7fafc;
  border-radius: 40rpx;
  padding: 20rpx 26rpx;
  margin-bottom: 36rpx;
  transition: all 0.3s;
}
.form-item:focus-within {
  background: #fff;
  box-shadow: 0 0 0 3rpx rgba(160, 174, 192, 0.3); /* 灰紫边框 */
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
}

/* 验证码 */
.captcha-img {
  width: 160rpx;
  height: 60rpx;
  margin-left: 20rpx;
  border-radius: 10rpx;
  border: 1rpx solid #e2e8f0;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}
.captcha-img:active {
  transform: scale(0.96);
  opacity: 0.8;
}

/* 注册按钮 */
.register-btn {
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
.register-btn:active {
  transform: scale(0.97);
  box-shadow: 0 4rpx 12rpx rgba(160, 174, 192, 0.25);
}

/* 底部 */
.footer {
  margin-top: 50rpx;
  text-align: center;
  z-index: 1;
}
.footer text {
  color: #4a5568;
  font-size: 28rpx;
}
.footer text:active {
  opacity: 0.7;
}

</style>
