const { QubicHelper } = require('@qubic-lib/qubic-ts-library/dist/qubicHelper');
const crypto = require('@qubic-lib/qubic-ts-library/dist/crypto');

// 导出到全局作用域
self.QubicHelper = QubicHelper;
self.crypto = crypto;

// 生成随机私钥（55个小写字母）
function generateRandomPrivateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let privateKey = '';
  for (let i = 0; i < 55; i++) {
    privateKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return privateKey;
}

// 检查地址是否符合前缀要求
function checkAddressPrefix(address, prefix) {
  return address.toLowerCase().startsWith(prefix.toLowerCase());
}

// 监听主线程消息
self.addEventListener('message', async (e) => {
  const { prefix } = e.data;
  
  while (true) {
    // 生成随机私钥
    const privateKey = generateRandomPrivateKey();
    
    // 使用 QubicHelper 计算公钥
    const publicKeyBytes = await crypto.getPublicKey(privateKey);
    const publicKey = QubicHelper.publicKeyBytesToString(publicKeyBytes);
    
    // 检查地址是否符合前缀
    if (checkAddressPrefix(publicKey, prefix)) {
      self.postMessage({
        found: true,
        privateKey,
        publicKey
      });
      break;
    }
  }
});
