# rcvoiceroomlib demo

## 线上演示 

[ 语聊房demo演示 ](https://apiv1-rcrtc.rongcloud.cn/voice)

![](https://tva1.sinaimg.cn/large/008i3skNly1gruboi2yg9j31000nealm.jpg)


## 项目安装
```
npm install
```

### 编译并发布
```
npm run serve
```

## 目录结构

主体目录结构如下。

### 语聊房目录结构

* `assets`：图片类静态文件
* `components`：封装的各公用组件或基础组件
* `pages`：视频通话模块相关业务逻辑及UI
* `request`：访问后端请求类api
* `router`：路由关系
* `store`：全局状态管理
* `utils`：基础工具

### 语聊房核心业务类

* `登录页`：Login.vue
* `首页`：Home.vue
* `语聊房列表`：room/index.vue
* `语聊房`：house/index.vue

## 如何运行？

1. 为了方便您快速运行项目，我们为您预置了融云 `appkey` 和对应的测试服务器 `url`，您不需要自己部署测试服务器即可运行。

2. 申请 BusinessToken

- BusinessToken 主要是防止滥用 demo 里的测试 `appKey`，我们为接口做了限制，一个 BusinessToken
  最多可以支持10个用户注册，20天使用时长。点击此处 [获取BusinessToken](https://rcrtc-api.rongcloud.net/code)

3. 申请完 BusinessToken 后,请在项目 `request` 下 `BusinessToken.js` 文件中替换即可。
   
4. 测试环境下登录时，验证码输入任意6位数字即可。


