# 介绍

uQRCode 2.5D码风格扩展。

> 支持uni-app组件

# 使用说明

## 引入

- 通过`import`引入。
``` javascript
import UQRCodePlugin25D from 'uqrcode.plugin.25d.es.js';
```

- `Node.js`通过`require`引入。
``` javascript
const UQRCodePlugin25D = require('uqrcode.plugin.25d.cjs.js');
```

- 原生浏览器环境，在js脚本加载时添加到`window`。
``` html
<script type="text/javascript" src="uqrcode.plugin.25d.umd.js"></script>
<script>
    var UQRCodePlugin25D = window.UQRCodePlugin25D;
</script>
```

## 原生方式使用

### 全局注册

```javascript
UQRCode.use(UQRCodePlugin25D);
```

### 实例注册

```javascript
const qr = new UQRCode();
qr.register(UQRCodePlugin25D);
```

### 使用示例

```javascript
// 获取uQRCode实例
var qr = new UQRCode();
// 设置uQRCode属性
qr.data = 'https://uqrcode.cn/doc'; // 指定二维码对应内容
qr.size = 220; // 指定要生成的二维码大小
qr.margin = 10; // 指定二维码的边距
// 注册扩展
qr.register(UQRCodePlugin25D);
// 设置扩展属性
qr.backgroundIs25D = true;
// 调用制作二维码方法
qr.make();

// 设置uQRCode实例的canvas上下文
qr.canvasContext = canvasContext;

// 调用扩展绘制方法将二维码图案绘制到canvas上
qr.draw25DCanvas();
```

## uni-app组件方式使用

### 注册扩展

```javascript
import UQRCodePlugin25D from 'uqrcode.plugin.25d.es.js';

export default {
  onReady() {
    /* 注册扩展插件 */
    this.$refs.qrcode.registerStyle(UQRCodePlugin25D); // qrcode为组件的ref名称
  }
}
```

## 使用示例

```html
<uqrcode ref="uqrcode" canvas-id="qrcode" value="https://uqrcode.cn/doc" :options="{ style: '25d', backgroundIs25D: true }"></uqrcode>
```

# 插件属性

### Type

- 类型：`string`
- 默认值：`'style'`
- 只读：`是`

插件类型。

### Name

- 类型：`string`
- 默认值：`'25d'`
- 只读：`是`

插件名称。

### DrawCanvas

- 类型：`string`
- 默认值：`'draw25DCanvas'`
- 只读：`是`

插件`drawCanvas`的函数名称。

# 扩展属性

### backgroundIs25D

- 类型：`boolean`
- 默认值：`true`
- 必填：`否`
- 只读：`否`

背景是否为2.5d。

# 扩展方法

### draw25DCanvas

- 类型：`Function`
- 返回值：`Promise`

绘制到canvas画布。