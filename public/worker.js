// 导入打包后的 Qubic 库
importScripts('/lib/qubic.bundle.js')

console.log('Qubic library:', self.qubic)
console.log('QubicHelper:', self.QubicHelper)

// 生成随机私钥（55个小写字母）
function generateRandomPrivateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let privateKey = ''
  for (let i = 0; i < 55; i++) {
    privateKey += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return privateKey
}

// 检查地址是否匹配模式
function checkPattern(address, pattern, isPrefix) {
  if (isPrefix) {
    return address.startsWith(pattern)
  }
  return address.endsWith(pattern)
}

let helper = null

// 开始生成地址
async function startGenerating(pattern, isPrefix, startCount = 0, workerId = 0) {
  let attempts = parseInt(startCount) || 0
  let lastProgressUpdate = Date.now()
  let lastAttempts = attempts
  
  try {
    console.log('Worker: Starting generation with params:', {
      pattern,
      isPrefix,
      startCount: attempts,
      workerId
    })

    if (!helper) {
      console.log('Creating new QubicHelper instance')
      helper = new self.QubicHelper()
    } else {
      console.log('Reusing existing QubicHelper instance')
    }
    
    // 开始生成
    while (true) {
      const seed = generateRandomPrivateKey()
      attempts++
      
      try {
        // 使用 Qubic 库生成地址
        const { publicId, privateKey } = await helper.createIdPackage(seed)
        
        // 检查是否找到匹配的地址
        if (checkPattern(publicId, pattern, isPrefix)) {
          console.log('Found matching address:', {
            publicId,
            pattern,
            isPrefix,
            attempts,
            workerId
          })
          
          self.postMessage({
            type: 'success',
            privateKey: seed,
            publicId,
            count: attempts,
            speed: 0,
            workerId
          })
          return
        }
      } catch (error) {
        console.error('Error generating address:', error)
        continue
      }
      
      // 更新进度和速度
      const now = Date.now()
      const timeDiff = (now - lastProgressUpdate) / 1000
      if (timeDiff >= 0.1) { // 每100ms计算一次速度
        const countDiff = attempts - lastAttempts
        const speed = Math.round(countDiff / timeDiff)
        lastProgressUpdate = now
        lastAttempts = attempts
        
        self.postMessage({ 
          type: 'progress',
          count: attempts,
          speed: speed,
          workerId
        })
      } else {
        // 只发送计数更新，不计算速度
        self.postMessage({ 
          type: 'count',
          count: attempts,
          workerId
        })
      }
    }
  } catch (error) {
    console.error('Worker error:', error)
    self.postMessage({
      type: 'error',
      error: error.message,
      speed: 0,
      workerId
    })
  }
}

// 监听主线程消息
self.onmessage = async (e) => {
  const { type, pattern, isPrefix, startCount, workerId } = e.data
  console.log('Worker: Received message:', {
    type,
    pattern,
    isPrefix,
    startCount,
    workerId
  })

  if (type === 'start') {
    await startGenerating(pattern, isPrefix, startCount, workerId)
  }
}

// Service Worker 部分
const CACHE_NAME = 'qubic-vanity-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/lib/qubic.bundle.js',
  '/worker.js'
];

// Service Worker 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Service Worker 获取事件
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果在缓存中找到响应，则返回缓存的版本
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
