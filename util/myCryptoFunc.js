/** 请请求加签响应验签的方法体 */
import func from "@/util/func";
import crypto from "@/util/cryptoUtil";


function myToJsonString(jsonStr) {
    let queryParams = encodeURIComponent(JSON.stringify(jsonStr,(key, value)=>{
        if (value === "") {
            return value;
        }
        if (value === false) {
            return value;
        }
        if (value === 0) {
            return value;
        }
        if (value instanceof Array) {
            if (value.length === 0) {
                return value;
            }
        }
        if (value instanceof Object) {
            if (JSON.stringify(value) === '{}'){
                return value;
            }
        }
        return value;
    }));
    return queryParams;
}

/**
 * 操作源对象 不需要返回值
 * @param data 源对象
 * @param headers 请求头
 */
export const requestSign = (data,headers,url) => {
    try {
        headers['client-type'] = "H5"
        // 签名params
        let searchParams = func.getRequestParams(url);
        if(data || searchParams && searchParams !== {}){
            // 将数据放在请求头中
            let jsonStr = {
                ...data,
                ...searchParams
            }
            let queryParams = myToJsonString(jsonStr);
            // 参数
            headers['queryParams'] = queryParams
            // 签名
            headers['queryParamsSigValueHex'] = crypto.encrypt(queryParams)
            // 	由于无法判断参数在 ？号后还是 body中，所以都加上
            // 	签名body如果有的话
            let bodyData = myToJsonString(data);
            // 参数
            headers['bodyData'] = bodyData
            // 签名
            headers['bodyDataSigValueHex'] = crypto.encrypt(bodyData)
        }
    }catch (e) {
        console.log(e)
    }
	return headers;
}

/**
 * 响应验签 操作源对象 不需要返回值
 * @param data 源对象
 */
export const responseSign = (res,data,url) => {
    // 测试始终打印日志
    uni.setStorageSync("myLogType",1);
    //取出缓存判断是否需要打印日志
    let item = uni.getStorageSync("myLogType");
    try {
        if (res.data) {
            let decrypt = crypto.decrypt(res.data);
            if(decrypt){
                // 解密成功返回解密的对象
                res.data = JSON.parse(decrypt);
            }else{
                if (item){
                    console.log("解密失败,返回原数据");
                }
            }
            if (item){
                console.log("==============  接口信息start  ==============")
                console.log('接口: ', url)
                console.log('参数: ', data)
                console.log('响应信息: ', res)
                console.log("==============  接口信息end  ==============")
            }
        }
    }catch (e) {
        console.log(e)
        console.log("==============  接口信息start  ==============")
        console.log('接口: ', url)
        console.log('参数: ', data)
        console.log('响应信息: ', res)
        console.log("==============  接口信息end  ==============")
    }
}