import App from './App'




// **************************************************注册自定义https工具 STA***********************************************************
// 引入全局请求方法 
import  '@/util/https.js'
// 引入 日期扩展包
// 引入之后 new Date.Format('yyyyMMdd')  传入格式
import  '@/util/newdate.js'
// 引入微信控制台
// import * as VConsole from '@/util/vconsole.min.js'
// // if (window.localStorage.getItem("adminDebug")){
// 	console.log(VConsole)
//     new VConsole();
// // }
// 引入饿了么ui
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// **************************************************注册自定义https工具 END***********************************************************



 



import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}

