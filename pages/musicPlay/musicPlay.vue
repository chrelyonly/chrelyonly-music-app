<template>
	<view class="player">
		<!-- 背景模糊封面 -->
		<image class="bg" :src="musicInfo.coverUrl" mode="aspectFill"></image>
		<!-- 半透明遮罩层，增强文字可读性 -->
		<view class="mask"></view>

		<!-- 歌名显示 -->
		<text class="title">{{ musicInfo.name }}</text>

		<!-- 歌曲封面 / 歌词切换区域 -->
			<!-- 歌曲封面显示 -->
			<view v-if="tabIndex===0" class="disc">
				<image class="cover" :class="{ rotate: isPlaying }" :src="musicInfo.coverUrl"></image>
			</view>
		
			<!-- 歌词显示 -->
			<scroll-view
				v-if="tabIndex===1"
				scroll-y
				class="lyric-box"
				:scroll-into-view="currentLyricId"
				scroll-with-animation
			>
				<view
					v-for="(line,idx) in nameLyric"
					:key="idx"
					:id="'lyric-'+idx"
					class="lyric-line"
					:class="{active: idx===currentLyricIndex}"
				>
					{{ line.text }}
				</view>
			</scroll-view>

		<!-- tab 切换按钮 -->
		<view class="tab">
			<text :class="tabIndex===0?'active':''" @click="tabIndex=0">歌曲</text>
			<text :class="tabIndex===1?'active':''" @click="tabIndex=1">歌词</text>
		</view>

		<!-- 播放进度条 -->
		<view class="progress">
			<!-- 当前播放时间 -->
			<text class="time">{{ currentTimeStr }}</text>
			<!-- 可拖动滑块 -->
			<slider 
				class="slider" 
				:value="progress" 
				@changing="onSeek" 
				@change="onSeekEnd"
				activeColor="#fff" 
				backgroundColor="#999" 
				block-size="16" 
			/>
			<!-- 总时长 -->
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

// 音乐信息对象
const musicInfo = ref({})
// 歌词数组 [{time,text}]
const nameLyric = ref([])
// 播放状态
const isPlaying = ref(false)
// 音频上下文对象
let audioCtx = null
// 当前播放时间
const currentTime = ref(0)
// 音乐总时长
const duration = ref(0)
// 进度百分比
const progress = ref(0)
// tab 切换索引，0:歌曲 1:歌词
const tabIndex = ref(0)

// 格式化后的时间字符串
const currentTimeStr = computed(() => formatTime(currentTime.value))
const durationStr = computed(() => formatTime(duration.value))

// 当前高亮歌词索引
const currentLyricIndex = ref(0)
// 当前高亮歌词对应 ID
const currentLyricId = computed(() => `lyric-${currentLyricIndex.value}`)

// 拖动进度条标记
let isSeeking = false 

// 页面加载
onLoad((option)=>{
	if(option.hash){
		loadMusicInfo(option.hash) // 加载音乐信息
		loadMusicPlay(option.hash) // 加载音频播放
	}else{
		uni.redirectTo({ url: "/pages/searchResult/searchResult" })
	}
})

// 加载音乐信息
const loadMusicInfo = (hash)=>{
	$https("/music-app/song/musicRadio","get",{ hash },1,{}).then(res=>{
		musicInfo.value = res.data.data
		if (musicInfo.value.nameLyric) {
			nameLyric.value = parseLrc(musicInfo.value.nameLyric) // 解析 LRC 歌词
		}
	})
}

// LRC 歌词解析函数
const parseLrc = (lrcText)=>{
	const lines = lrcText.split("\n")
	let result = []
	const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
	lines.forEach(line=>{
		const match = line.match(timeReg)
		if(match){
			let min = parseInt(match[1])
			let sec = parseInt(match[2])
			let ms = match[3] ? parseInt(match[3]) : 0
			if(match[3].length===2) ms *= 10
			let time = min*60 + sec + ms/1000
			let text = line.replace(timeReg,"").trim()
			if(text) result.push({time,text})
		}
	})
	return result.sort((a,b)=>a.time-b.time)
}

// 加载音乐播放
const loadMusicPlay = (hash)=>{
	audioCtx = uni.createInnerAudioContext()
	audioCtx.src = $serviceName + "/music-app/song/musicPlay?hash=" + hash

	// 时间更新事件
	audioCtx.onTimeUpdate(()=>{
		if(audioCtx.currentTime === 0) return
		if(!isSeeking){
			currentTime.value = audioCtx.currentTime
			duration.value = audioCtx.duration
			progress.value = (currentTime.value/duration.value)*100
			updateLyric(currentTime.value) // 同步歌词高亮
		}
	})
	// 播放结束事件
	audioCtx.onEnded(()=>{ isPlaying.value = false })
}

// 播放 / 暂停切换
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

// 拖动进度条中
const onSeek = (e)=>{
	if(!audioCtx) return
	isSeeking = true
	const seekTime = (e.detail.value / 100) * duration.value
	currentTime.value = seekTime
	progress.value = e.detail.value
}

// 拖动进度条结束
const onSeekEnd = (e)=>{
	if(!audioCtx) return
	const seekTime = (e.detail.value / 100) * duration.value
	audioCtx.seek(seekTime)
	currentTime.value = seekTime
	progress.value = e.detail.value
	isSeeking = false
}

// 根据时间更新歌词高亮
const updateLyric = (time)=>{
	for(let i=nameLyric.value.length-1;i>=0;i--){
		if(time >= nameLyric.value[i].time){
			currentLyricIndex.value = i
			break
		}
	}
}

// 时间格式化函数
const formatTime = (sec)=>{
	if(!sec) return "00:00"
	let m = Math.floor(sec/60)
	let s = Math.floor(sec%60)
	return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
}
</script>

<style scoped>
/* tab 切换淡入淡出动画 */
.tab-fade-enter-active, .tab-fade-leave-active { transition: opacity 0.3s ease; }
.tab-fade-enter, .tab-fade-leave-to { opacity: 0; }

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

.title { margin-top: 80rpx; font-size: 40rpx; font-weight: bold; }

.disc {
	margin: 60rpx 0;
	height: 100%;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.cover {
	border: 8rpx solid rgba(255,255,255,0.3);
	width: 320rpx;
	height: 320rpx;
	border-radius: 50%;
}
.rotate { animation: spin 12s linear infinite; }
@keyframes spin { 0%{transform: rotate(0deg);} 100%{transform: rotate(360deg);} }

.tab {
	display: flex;
	justify-content: center;
	margin: 30rpx 0;
	gap: 40rpx;
}
.tab text { font-size: 28rpx; color: #ccc; }
.tab .active { color: #fff; font-weight: bold; }

.lyric-box { flex: 1; width: 100%; text-align: center; overflow-y: scroll; }
.lyric-line { font-size: 28rpx; color: #ccc; line-height: 2; }
.lyric-line.active { color: #fff; font-size: 34rpx; font-weight: bold; }

.progress {
	width: 80%;
	display: flex;
	align-items: center;
	margin: 20rpx 0;
}
.time { font-size: 24rpx; width: 80rpx; text-align: center; }
.slider { flex: 1; }

.controls {
	margin-bottom: 120rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 80%;
	font-size: 40rpx;
}
.play-btn { font-size: 60rpx; }
.icon { font-size: 40rpx; color: #fff; }
</style>
