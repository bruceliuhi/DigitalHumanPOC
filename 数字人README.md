# DigitalMan

## 使用说明

### 安装依赖

需要以下依赖：

- `axios`
- `crypto-js`
- `tcplayer.js`
- `three.js`
- `uuid` 

安装方法

```zsh
npm install axios uuid crypto-js tcplayer.js three

pnpm add axios uuid crypto-js tcplayer.js three
```

### 引入

```JavaScript
import { DigitalMan } from 'DigitalMan.js'
```

### 挂载到页面元素

**_要求元素id为'Digital-Man'_**

```HTML
<div id="Digital-Man"></div>
```

**_注意宽高不要全都设置为auto,否则数字人不显示_**
**_也不要仅为宽度设置数值，高度设置为auto,数字人同样不显示_**

```CSS
#Digital-Man {
  width: 400px;
  height: 400px;
  background-color: blue;
  /* 视频流为透明背景，可以自行添加背景色 */
}
```

### 创建实例

**`DigitalMan()`构造器接收一个对象，该对象包含以下属性:**

- appkey: `String`  **应用appkey**
- appsecret: `String`  **应用appsecret**
- licenseUrl: `String`  **腾讯云TcPlayer播放器授权url**
- mobile: `String`  **手机号**
- name: `String`  **本次开播唯一名称，账号下同样名称的应用会被踢下线**
- voice_id: `String`  **数字人音色**
- voice_volume: `Number`  **数字人音量**
- voice_speed: `Number`  **数字人语速**
- figure_id: `String`  **数字人id**

```JavaScript
const DM = new DigitalMan({
    appkey: 'your_appkey',
    appsecret: 'your_appsecret',
    licenseUrl: 'your_licenseUrl',
    mobile: 'your_mobile',
    name: 'your_figure_name',
    voice_id: 'your_voice_id',
    voice_volume: 10, //示例值
    voice_speed: 5, //示例值
    figure_id: 'your_figure_id',
  })
```

### 初始化视频

```JavaScript
await DM._initializer()
```

### 流式文本驱动指令

```JavaScript
await DM._streamCommand('your_text')
```

### 中断

```JavaScript
await DM._interrupt()
```

### 获取当前文本

有两种方式：

- 直接通过接口获取(非实时)：
- 通过传入回调函数获取实时文本和文本队列(实时)以及当前是否为静默状态(流式文本结束指令)

```JavaScript
// 直接通过接口获取当前文本
const lastText = DM._currentText()

// 通过传入回调获取当前文本和文本队列内容
DM.setCurrentTextCallback((currentText, queue, isFinal) => {
  console.log(currentText, queue, isFinal)
  // currentText: 当前文本
  // queue: 文本队列(数组)
  // isFinal: 当前是否为静默状态(流式文本结束指令)
})
```

### 流式文本结束指令(final指令)

```JavaScript
await DM._streamEnd()
```

### 关闭会话

```JavaScript
await DM._closeConnection()
```
