<template>
  <view class="register-container">
    <!-- 顶部 Logo -->
    <view class="logo-section">
      <image class="logo" src="https://q1.qlogo.cn/g?b=qq&nk=123456&s=640" mode="aspectFill"></image>
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
  background: linear-gradient(135deg,#ff758c,#ff7eb3);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;
}
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
.captcha-img {
  width: 160rpx;
  height: 60rpx;
  margin-left: 20rpx;
  border-radius: 8rpx;
}
.register-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg,#ff758c,#ff7eb3);
  border-radius: 40rpx;
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  box-shadow: 0 6rpx 18rpx rgba(255,118,148,0.4);
}
.footer {
  margin-top: 40rpx;
}
.footer text {
  color: #fff;
  font-size: 26rpx;
}
</style>
