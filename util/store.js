import {
    validatenull
} from '@/util/validate';

const keyName = 'chrelyonly-';
/**
 * 存储
 */
export const setStore = (params = {}) => {
    let {
        name,
        content,
    } = params;
    name = keyName + name
    let obj = {
        dataType: typeof (content),
        content: content,
        datetime: new Date().getTime()
    }
	uni.setStorageSync(name, content) 
}
/**
 * 获取
 */

export const getStore = (params = {}) => {
    let {
        name
    } = params;
    name = keyName + name
    return uni.getStorageSync(name)
}
/**
 * 删除
 */
export const removeStore = (params = {}) => {
    let {
        name,
        type
    } = params;
    name = keyName + name
	uni.clearStorageSync(name)

}
