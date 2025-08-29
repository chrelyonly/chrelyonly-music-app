<template>
	<view class="edit-container">
		<!-- 头像 -->
		<view class="avatar-section">
			<view class="avatar-box" @click="chooseAvatar">
				<image class="avatar" :src="form.tempAvatar" mode="aspectFill"></image>
				<view class="avatar-mask">更换头像</view>
			</view>
		</view>

		<!-- 输入区域 -->
		<view class="form-section">
			<view class="form-item">
				<text class="label">昵称</text>
				<input class="input" v-model="form.title" placeholder="请输入昵称" maxlength="20" />
			</view>

			<view class="form-item">
				<text class="label">个性签名</text>
				<textarea class="textarea" v-model="form.sign" placeholder="写点什么吧..." maxlength="100" auto-height />
			</view>

			<view class="form-item">
				<text class="label">性别</text>
				<radio-group @change="onGenderChange" class="radio-group">
					<label class="radio-item">
						<radio value="男" :checked="form.sex==='男'" color="#ff6b81" /> 男
					</label>
					<label class="radio-item">
						<radio value="女" :checked="form.sex==='女'" color="#ff6b81" /> 女
					</label>
					<label class="radio-item">
						<radio value="保密" :checked="form.sex==='保密'" color="#ff6b81" /> 保密
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
	import {
		ref
	} from "vue"
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import {
		setStore,
		getStore
	} from '@/util/store.js'

	const form = ref({
		tempAvatar: "/static/login/logo.png",
		avatarPath: "/static/login/logo.png",
		title: "因哟",
		sign: "用音乐记录生活 🎵",
		sex: "保密"
	})

	// 选择头像
	const chooseAvatar = () => {
		uni.chooseImage({
			count: 1,
			success: res => {
				const tempPath = res.tempFilePaths[0]
				form.value.tempAvatar = tempPath // 本地预览


		const file = res.tempFiles[0] // H5 下用 File 对象
		const maxSize = 3 * 1024 * 1024 // 2MB
		      if (file.size > maxSize) {
		        uni.showToast({
		          title: "图片不能超过 3MB",
		          icon: "none"
		        })
		        return
		      }
// #ifdef H5
		const reader = new FileReader()
		  reader.readAsDataURL(file)
		  reader.onload = () => {
			const base64Str = reader.result // 这里就是 base64
			form.value.avatarPath = base64Str
		}
// #endif
// #ifndef H5

	// 转换成 base64
	uni.getFileSystemManager().readFile({
		filePath: tempPath,
		encoding: "base64",
		success: data => {
			// 拼接成完整的 base64
			const base64Str = "data:image/png;base64," + data.data
			form.value.avatarPath = base64Str
		}
	})
// #endif
			}
		})
	}

	// 修改性别
	const onGenderChange = e => {
		form.value.sex = e.detail.value
	}

	// 保存信息
	const saveInfo = () => {
		
		
		let params = {
			avatar: form.value.avatarPath,
			title: form.value.title,
			sign: form.value.sign,
			sex: form.value.sex,
		}
		uni.showLoading({
			mask:true,
		})
		$https("/music-app/user/editProfile","post",params,2,{}).then( res=> {
			uni.showToast({
				title: res.data.msg
			})
			setTimeout(()=>{
				uni.switchTab({
					url: "/pages/profile/profile"
				})
			},500)
		}).finally(()=>{
			uni.hideLoading()
		})
	}


	onLoad(() => {
		getUserInfo()
	})
	const userInfo = ref({})
	const getUserInfo = () => {
		userInfo.value = getStore({
			name: "userInfo"
		})
		form.value.tempAvatar = userInfo.value.avatar
		form.value.avatarPath = userInfo.value.avatar
		form.value.title = userInfo.value.title
		form.value.sign = userInfo.value.sign
		form.value.sex = userInfo.value.sex
	}
</script>

<style scoped>
	.edit-container {
	  background: linear-gradient(135deg,#dfe9f3,#f8f9fa); /* 柔和灰白背景 */
	  min-height: 100vh;
	  padding: 40rpx 30rpx;
	  position: relative;
	  overflow: hidden;
	}
	
	/* 背景点缀柔光 */
	.edit-container::before,
	.edit-container::after {
	  content: "";
	  position: absolute;
	  border-radius: 50%;
	  filter: blur(160rpx);
	  opacity: 0.25;
	}
	.edit-container::before {
	  width: 460rpx;
	  height: 460rpx;
	  background: rgba(160, 174, 192, 0.25); /* 灰紫 */
	  top: -160rpx;
	  left: -100rpx;
	}
	.edit-container::after {
	  width: 420rpx;
	  height: 420rpx;
	  background: rgba(226, 232, 240, 0.25); /* 浅灰蓝 */
	  bottom: -120rpx;
	  right: -100rpx;
	}
	
	/* 头像 */
	.avatar-section {
	  display: flex;
	  justify-content: center;
	  margin-bottom: 50rpx;
	  z-index: 1;
	}
	.avatar-box {
	  position: relative;
	  width: 180rpx;
	  height: 180rpx;
	  border-radius: 50%;
	  overflow: hidden;
	  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	}
	.avatar {
	  width: 100%;
	  height: 100%;
	}
	.avatar-mask {
	  position: absolute;
	  bottom: 0;
	  width: 100%;
	  background: rgba(74, 85, 104, 0.6); /* 深灰蓝半透明 */
	  text-align: center;
	  font-size: 24rpx;
	  color: #fff;
	  padding: 8rpx 0;
	}
	
	/* 表单 */
	.form-section {
	  background: #fff;
	  border-radius: 20rpx;
	  padding: 28rpx;
	  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.05);
	  z-index: 1;
	}
	.form-item {
	  margin-bottom: 32rpx;
	}
	.label {
	  font-size: 28rpx;
	  color: #4a5568; /* 深灰蓝 */
	  font-weight: 500;
	  margin-bottom: 12rpx;
	  display: block;
	}
	.input {
	  border: none;
	  border-bottom: 2rpx solid #e2e8f0;
	  font-size: 28rpx;
	  padding: 12rpx 0;
	  width: 100%;
	  transition: border 0.2s;
	}
	.input:focus {
	  border-bottom: 2rpx solid #a0aec0; /* 灰紫 */
	}
	.textarea {
	  width: 100%;
	  min-height: 120rpx;
	  padding: 14rpx;
	  font-size: 26rpx;
	  background: #f7fafc;
	  border-radius: 14rpx;
	  border: 1rpx solid #e2e8f0;
	}
	
	/* 性别单选 */
	.radio-group {
	  display: flex;
	  gap: 40rpx;
	  margin-top: 12rpx;
	}
	.radio-item {
	  font-size: 26rpx;
	  color: #4a5568;
	}
	
	/* 保存按钮 */
	.btn-box {
	  margin-top: 70rpx;
	  z-index: 1;
	}
	.save-btn {
	  background: linear-gradient(135deg,#a0aec0,#cbd5e0); /* 灰蓝渐变 */
	  border: none;
	  border-radius: 40rpx;
	  font-size: 30rpx;
	  height: 90rpx;
	  line-height: 90rpx;
	  font-weight: 600;
	  color: #fff;
	  box-shadow: 0 6rpx 16rpx rgba(160, 174, 192, 0.3);
	  transition: all 0.25s;
	}
	.save-btn:active {
	  transform: scale(0.97);
	  box-shadow: 0 4rpx 12rpx rgba(160, 174, 192, 0.25);
	}

</style>