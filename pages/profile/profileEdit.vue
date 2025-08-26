<template>
  <view class="edit-container">
    <!-- 头像 -->
    <view class="avatar-section">
      <view class="avatar-box" @click="chooseAvatar">
        <image class="avatar" :src="form.avatar" mode="aspectFill"></image>
        <view class="avatar-mask">更换头像</view>
      </view>
    </view>

    <!-- 输入区域 -->
    <view class="form-section">
      <view class="form-item">
        <text class="label">昵称</text>
        <input 
          class="input" 
          v-model="form.nickname" 
          placeholder="请输入昵称" 
          maxlength="20"
        />
      </view>

      <view class="form-item">
        <text class="label">个性签名</text>
        <textarea 
          class="textarea" 
          v-model="form.signature" 
          placeholder="写点什么吧..." 
          maxlength="100"
          auto-height
        />
      </view>

      <view class="form-item">
        <text class="label">性别</text>
        <radio-group @change="onGenderChange" class="radio-group">
          <label class="radio-item">
            <radio value="男" :checked="form.gender==='男'" color="#ff6b81"/> 男
          </label>
          <label class="radio-item">
            <radio value="女" :checked="form.gender==='女'" color="#ff6b81"/> 女
          </label>
          <label class="radio-item">
            <radio value="保密" :checked="form.gender==='保密'" color="#ff6b81"/> 保密
          </label>
        </radio-group>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="btn-box">
      <button class="save-btn" type="primary" @click="saveInfo">保存修改</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"

const form = ref({
  avatar: "https://q1.qlogo.cn/g?b=qq&nk=123456&s=640",
  nickname: "音乐小王子",
  signature: "用音乐记录生活 🎵",
  gender: "保密"
})

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: res => {
      form.value.avatar = res.tempFilePaths[0]
    }
  })
}

// 修改性别
const onGenderChange = e => {
  form.value.gender = e.detail.value
}

// 保存信息
const saveInfo = () => {
  uni.showToast({
    title: "保存成功",
    icon: "success"
  })
  // 这里可以调用后端 API 提交 form.value
}
</script>

<style scoped>
.edit-container {
  background: #f9f9f9;
  min-height: 100vh;
  padding: 40rpx 30rpx;
}

/* 头像部分 */
.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 50rpx;
}
.avatar-box {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.15);
}
.avatar {
  width: 100%;
  height: 100%;
}
.avatar-mask {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0,0,0,0.4);
  text-align: center;
  font-size: 24rpx;
  color: #fff;
  padding: 8rpx 0;
}

/* 表单部分 */
.form-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}
.form-item {
  margin-bottom: 30rpx;
}
.label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 10rpx;
  display: block;
}
.input {
  border: none;
  border-bottom: 2rpx solid #eee;
  font-size: 28rpx;
  padding: 12rpx 0;
  width: 100%;
}
.textarea {
  width: 100%;
  min-height: 100rpx;
  padding: 12rpx;
  font-size: 26rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  border: none;
}
.radio-group {
  display: flex;
  gap: 40rpx;
  margin-top: 10rpx;
}
.radio-item {
  font-size: 26rpx;
  color: #444;
}

/* 按钮 */
.btn-box {
  margin-top: 60rpx;
}
.save-btn {
  background: linear-gradient(135deg,#ff758c,#ff7eb3);
  border: none;
  border-radius: 40rpx;
  font-size: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  box-shadow: 0 6rpx 20rpx rgba(255,118,148,0.4);
}
</style>
