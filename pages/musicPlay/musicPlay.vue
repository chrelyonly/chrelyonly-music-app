<template>
	<view class="player">
		<!-- 背景模糊封面 -->
		<image class="bg" :src="musicInfo.image" mode="aspectFill"></image>
		<view class="mask"></view>

		<!-- 歌名 -->
		<text class="title">{{ musicInfo.name }}</text>

		<!-- 唱片封面 -->
		<view v-if="tabIndex===0" class="disc">
			<image class="cover" :class="{ rotate: isPlaying }" :src="musicInfo.image"></image>
		</view>

		<!-- 歌词 -->
		<scroll-view
			v-else
			scroll-y
			class="lyric-box"
			:scroll-into-view="currentLyricId"
			scroll-with-animation
		>
			<view
				v-for="(line,idx) in lyrics"
				:key="idx"
				:id="'lyric-'+idx"
				class="lyric-line"
				:class="{active: idx===currentLyricIndex}"
			>
				{{ line.text }}
			</view>
		</scroll-view>

		<!-- tab 歌曲 / 歌词 -->
		<view class="tab">
			<text :class="tabIndex===0?'active':''" @click="tabIndex=0">歌曲</text>
			<text :class="tabIndex===1?'active':''" @click="tabIndex=1">歌词</text>
		</view>

		<!-- 进度条 -->
		<view class="progress">
			<text class="time">{{ currentTimeStr }}</text>
			<slider class="slider" :value="progress" @change="onSeek"
				activeColor="#fff" backgroundColor="#999" block-size="16" />
			<text class="time">{{ durationStr }}</text>
		</view>

		<!-- 控制按钮 -->
		<view class="controls">
			<text class="icon">☆</text>
			<text class="icon">⏮</text>
			<text class="play-btn" @click="togglePlay">{{ isPlaying ? '⏸' : '▶' }}</text>
			<text class="icon">⏭</text>
			<text class="icon">☰</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const musicInfo = ref({
	image:"http://imge.kugou.com/stdmusic/{size}/20240428/20240428110653306668.jpg",
	url:"http://fs.youthandroid2.kugou.com/202508251541/1e385dfe9c48ca054d249bbf278fa73e/v3/1f62c7d9b83059cc879da895e0ad64cf/yp/full/ap3116_us0_mi336d5ebc5436534e61d16e63ddfca327_pi411_mx0_qu128_ct510100_s1826936956.mp3",
	name:"海阔天空",
	// 示例 LRC 地址，可以换成真实接口返回的歌词文件
	lrc:"https://cdn.jsdelivr.net/gh/azhaohui/netease-lrc/BEYOND-海阔天空.lrc"
})

const isPlaying = ref(false)
let audioCtx = null
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const tabIndex = ref(0)

const currentTimeStr = computed(()=>formatTime(currentTime.value))
const durationStr = computed(()=>formatTime(duration.value))

// 歌词数据
const lyrics = ref([])
const currentLyricIndex = ref(0)
const currentLyricId = computed(()=>`lyric-${currentLyricIndex.value}`)

onLoad(()=>{
	audioCtx = uni.createInnerAudioContext()
	audioCtx.src = musicInfo.value.url
	audioCtx.onTimeUpdate(()=>{
		currentTime.value = audioCtx.currentTime
		duration.value = audioCtx.duration
		progress.value = (currentTime.value/duration.value)*100
		updateLyric(currentTime.value)
	})
	audioCtx.onEnded(()=>{
		isPlaying.value = false
	})

	// 加载歌词
	loadLyric()
})

const togglePlay = ()=>{
	if(!audioCtx) return
	if(isPlaying.value){
		audioCtx.pause()
		isPlaying.value=false
	}else{
		audioCtx.play()
		isPlaying.value=true
	}
}

const onSeek = (e)=>{
	if(!audioCtx) return
	let seekTime = duration.value * (e.detail.value/100)
	audioCtx.seek(seekTime)
}

// 歌词高亮
const updateLyric = (time)=>{
	for(let i=0;i<lyrics.value.length;i++){
		if(time >= lyrics.value[i].time){
			currentLyricIndex.value = i
		}
	}
}

// 加载并解析 LRC
const loadLyric = ()=>{
	uni.request({
		url: musicInfo.value.lrc,
		success:res=>{
			lyrics.value = parseLrc(res.data)
		}
	})
}

// LRC 解析
const parseLrc = (lrcText)=>{
	const lines = lrcText.split("\n")
	let result = []
	const timeReg = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/
	lines.forEach(line=>{
		const match = line.match(timeReg)
		if(match){
			let min = parseInt(match[1])
			let sec = parseInt(match[2])
			let ms = match[3] ? parseInt(match[3]) : 0
			if(match[3] && match[3].length===2){ ms = ms*10 } // 2位转毫秒
			let time = min*60 + sec + ms/1000
			let text = line.replace(timeReg,"").trim()
			if(text) result.push({time,text})
		}
	})
	return result.sort((a,b)=>a.time-b.time)
}

const formatTime = (sec)=>{
	if(!sec) return "00:00"
	let m = Math.floor(sec/60)
	let s = Math.floor(sec%60)
	return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
}
</script>

<style scoped>
.player {
	position: relative;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	color: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
}

/* 背景模糊 */
.bg {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0; left: 0;
	filter: blur(40rpx);
	transform: scale(1.2);
	z-index: -2;
}
.mask {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0; left: 0;
	background: rgba(0,0,0,0.4);
	z-index: -1;
}

.title {
	margin-top: 80rpx;
	font-size: 40rpx;
	font-weight: bold;
}

.disc {
	margin: 60rpx 0;
	width: 400rpx;
	height: 400rpx;
	border-radius: 50%;
	border: 8rpx solid rgba(255,255,255,0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}
.cover {
	width: 320rpx;
	height: 320rpx;
	border-radius: 50%;
}
.rotate {
	animation: spin 12s linear infinite;
}
@keyframes spin {
	0%{transform: rotate(0deg);}
	100%{transform: rotate(360deg);}
}

.tab {
	display: flex;
	justify-content: center;
	margin: 30rpx 0;
	gap: 40rpx;
}
.tab text {
	font-size: 28rpx;
	color: #ccc;
}
.tab .active {
	color: #fff;
	font-weight: bold;
}

.lyric-box {
	flex: 1;
	width: 100%;
	margin-top: 40rpx;
	text-align: center;
}
.lyric-line {
	font-size: 28rpx;
	color: #ccc;
	line-height: 2;
}
.lyric-line.active {
	color: #fff;
	font-size: 34rpx;
	font-weight: bold;
}

.progress {
	width: 80%;
	display: flex;
	align-items: center;
	margin: 20rpx 0;
}
.time {
	font-size: 24rpx;
	width: 80rpx;
	text-align: center;
}
.slider {
	flex: 1;
}

.controls {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 80%;
	font-size: 40rpx;
}
.play-btn {
	font-size: 60rpx;
}
.icon {
	font-size: 40rpx;
	color: #fff;
}
</style>
