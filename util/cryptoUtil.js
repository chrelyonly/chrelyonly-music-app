import {myCrypto as CryptoJS} from '/util/crypto-js.js'


function generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}
export default class crypto {
  // 使用AesUtil.genAesKey()生成,需和后端配置保持一致
  static aesKey = "PLBcl7aIV3qtcSvrgpLt6WMrEcskY1no";

  // 使用DesUtil.genDesKey()生成,需和后端配置保持一致
  static desKey = "jMVCBsFGDQr1USHo";

  /**
   * aes 加密方法
   * @param data
   * @returns {*}
   */
  static encrypt(data) {
	const aesKey = generateRandomString();
    return this.encryptAES(data, aesKey);
  }

  /**
   * aes 解密方法
   * @param data
   * @returns {*}
   */
  static decrypt(data) {
	  // 从data的前16位截取获取iv 从最后32位截取获取解密密钥
	  // 先将 Base64 解码为 WordArray
    return this.decryptAES(atob(data));
  }

  /**
   * aes 加密方法，同java：AesUtil.encryptToBase64(text, aesKey);
   */
  static encryptAES(data, key) {
    const dataBytes = CryptoJS.enc.Utf8.parse(data);
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
	const iv = CryptoJS.lib.WordArray.random(16); // 生成16字节 IV
    const encrypted = CryptoJS.AES.encrypt(dataBytes, keyBytes, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
	  // 拼接：IV（16字节） + 密文（WordArray）
	const combined = iv.clone().concat(encrypted.ciphertext).concat(keyBytes);
	return CryptoJS.enc.Base64.stringify(combined);
    // return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  /**
   * aes 解密方法，同java：AesUtil.decryptFormBase64ToString(encrypt, aesKey);
   */
  static decryptAES(data) {
  // 提取 IV（前16位），Key（最后32位），CipherText（中间部分）
  const ivStr = data.substring(0, 16);
  const keyStr = data.substring(data.length - 32);
  const cipherText = data.substring(16, data.length - 32);

  // const keyBytes = CryptoJS.enc.Utf8.parse("qv7plo5szuh4mqlwnctwo23xb87cot3v");
  // const ivBytes = CryptoJS.enc.Utf8.parse("1234567890123456");
  const keyBytes = CryptoJS.enc.Utf8.parse(keyStr);
  const ivBytes = CryptoJS.enc.Utf8.parse(ivStr);
    const decrypted = CryptoJS.AES.decrypt(btoa(cipherText), keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  }

  /**
   * des 加密方法，同java：DesUtil.encryptToBase64(text, desKey)
   */
  static encryptDES(data, key) {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.DES.encrypt(data, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  /**
   * des 解密方法，同java：DesUtil.decryptFormBase64(encryptBase64, desKey);
   */
  static decryptDES(data, key) {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.DES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(data)
    }, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
