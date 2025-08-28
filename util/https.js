// 引入加密包
import {requestSign,responseSign} from "@/util/myCryptoFunc"
import { getStore } from '@/util/store.js'
//服务器项目地址  ！！！！！ 请填写 服务器后台接口地址(推荐使用反向代理进行配置)   api反向代理的地址   部署换成服务器
// 服务器器域名 ,本地测试用,部署就留空
// #ifdef APP
// const serviceName = 'https://nginx-3.frp.chrelyonly.cn/api';
const serviceName = 'http://192.168.1.19:8078';
// #endif
// #ifdef H5
const serviceName = '/api';
// #endif
// const serviceName = 'http://phone.chrelyonly.cn';

/**
 * 用法
 * 自定义全局通用方法传入
 * @param url 请求地址
 * @param method 方法  get post
 * @param params 参数 a={} 或者 {a:1},{b:2]
 * @param type 类型   1       2
 * @param headers 请求头{}
 * 返回数据200在第then的一个参数,其他在第二个参数
 * @returns {*}
 */
const https = (url,method, params,type,headers) => {
    return new Promise((resolve, reject) => {
        // 处理请求方法变量名
        if (method === 'get') {
            method = 'GET'
        }else if (method === 'post') {
            method = 'POST'
        }else {
            uni.showToast({
                title: '不支持的请求方法',
                icon: 'none'
            })
            reject("不支持的请求方法")
        }
        // 处理请求头
        if (type === 1) {
            headers["Content-Type"] = 'application/x-www-form-urlencoded; charset=utf-8'
        } else if (type === 2) {
            headers["Content-Type"] = 'application/json'
        }
		//固定塞入请求头acctoken,如果有的话
		try {
			let accToken = getStore({name: "accToken"})
			if(accToken){
				headers["Authorization"] = accToken
			}
		} catch (error) {
			//TODO handle the exception
		}
        // ******************************************************************加解密处理开始,对请求数据进行加签防止篡改 ,对data(?传参) data(body请求体) 进行加签
        // headers = requestSign(params, headers,url);
        // ******************************************************************加解密处理结束
        uni.request({
            header: headers,
            method: method,
            url: serviceName + url,
            data: params,
            success: (res) => {
                //******************************************************************加解密处理开始-chrelyonly 对返回数据进行验签
                // responseSign(res,params,url);
                //******************************************************************加解密处理结束-chrelyonly
                if (res.data.code === 200) {
                  resolve(res)
                }else if (res.data.code === 401) {
                  console.log('============== 请求异常 ==============')
                  console.log('接口: ', url)
                  console.log('异常信息: ', res)
                  console.log('============== 请求异常 ==============')
                  uni.showToast({
                    title: res.data.msg,
                    icon: "none"
                  });
                  reject(res)
                }else {
                  console.log('============== 请求异常 ==============')
                  console.log('接口: ', url)
                  console.log('异常信息: ', res)
                  console.log('============== 请求异常 ==============')
                  uni.showToast({
                    title: res.data.msg,
                    icon: "none"
                  });
                  reject(res)
                }
            },
            fail: (e) => {
                console.log(e)
                uni.showToast({
                    title: '系统异常',
                    icon: 'none'
                })
                reject(e)
            },
        })
    })
}
globalThis.$https = https;