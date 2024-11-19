const { QubicHelper } = require('@qubic-lib/qubic-ts-library/dist/qubicHelper');
const crypto = require('@qubic-lib/qubic-ts-library/dist/crypto');

// 导出到全局作用域
self.QubicHelper = QubicHelper;
self.crypto = crypto;

// 打印导出的内容
console.log('QubicHelper:', QubicHelper);
console.log('crypto:', crypto);
