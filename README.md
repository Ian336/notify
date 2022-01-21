1 chrome.tabs.create({ url: 'https://www.baidu.com' })跳转新的页面
2 chrome.tabs.update(tabId, { url: 'http://www.google.com' });跳转到原来的页面
3 设置同步不可见的 storage,也可以直接用原来的方法设置可见的 stroage

```js
chrome.storage.local.get(['notifyTime'], (res) => {
  console.log(res)
  this.startTime(res.notifyTime)
})
chrome.storage.local.set(
  { notifyTime: value + '' },
  //通知后台更改默认时间
  function() {
    chrome.runtime.sendMessage({ notifyTime: value })
    console.log({ notifyTime: value })
  }
)
```

4 消息通知<=>消息监听

```js
chrome.runtime.sendMessage({ closeNotify: true })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('sender', message, sender, sendResponse)

  if (message.closeNotify) {
    clearInterval(this.timer)
    return
  }
  if (message.notifyTime) {
    clearInterval(this.timer)
    that.startTime(message.notifyTime)
  }
})
```

5 弹窗提醒

```js
chrome.notifications.create(null, {
  type: 'image',
  iconUrl: chrome.extension.getURL('assets/icon/500.png'),
  title: '主人',
  message: '该休息一下了',
  eventTime: 60000,
  imageUrl:
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F14%2F20200314172044_WAuL3.thumb.1000_0.gif&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645261638&t=7acdd5e598c5a87af3d1448b3738d73c',
})
```

> [更好的文档体验](https://www.yuque.com/goozyshi/tech/qc5p0k)

### gitee 项目地址

[**https://gitee.com/goozyshi/crx-thumbs**](https://gitee.com/goozyshi/crx-thumbs)

```
// 安装依赖
yarn 或者 npm i
// 打包，文件在dist目录下
yarn crx 或者 yarn build
//查看打包大小
yarn size
```

### 添加拓展到 chrome

![load.png](https://cdn.nlark.com/yuque/0/2019/png/608421/1577334198936-5212b8c3-f875-4837-a479-da9e9ee7222e.png)

### 实现效果

**![popup.gif](https://cdn.nlark.com/yuque/0/2019/gif/608421/1577326635094-1a02cefa-3924-47b9-862a-044a02d6d9fc.gif) ![options.gif](https://cdn.nlark.com/yuque/0/2019/gif/608421/1577326554116-2db873ca-3ec6-464a-8348-e5735ec1650c.gif)**

**![gesture.gif](https://cdn.nlark.com/yuque/0/2019/gif/608421/1577326574370-24e183a4-e624-4d83-9f9a-3086ac65fdb2.gif)**

## manifestion 清单文件（以 dev 版为例）

> crx 插件配置文件

```
{
    "manifest_version": 2,
    "name": "thumbs",
    "description": "gesture && today-poetry",
    "icons": {
        "19": "assets/icon/icon_19.png",
        "38": "assets/icon/icon_38.png",
        "76": "assets/icon/icon_76.png"
    },
    "version": "0.0.1",
    "options_page": "options.html",
    "browser_action": {
        "default_title": "捣鼓着玩的手势插件",
        "default_icon": {
            "19": "assets/icon/icon_19.png",
            "38": "assets/icon/icon_38.png",
            "76": "assets/icon/icon_76.png"
        },
        "default_popup": "popup.html"
    },
    "content_scripts": [{
        "matches": ["https://*/*", "http://*/*"],
        "js": ["assets/js/content.js"],
        "run_at": "document_end"
    }],
    "background": {
        "page": "background.html"
    },
    "web_accessible_resources": [ "assets/up.png", "assets/down.png", "assets/left.png", "assets/right.png" ],
    "permissions": ["storage", "notifications", "tabs", "bookmarks"],
    "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"
}
```

### browser_action

浏览器右上角图标设置，可选值有 browser_action、page_action、app、theme

- default_popup： popup 页面

popup 页面只在用户点击图标时才会开启，当用户关闭这个页面时就会停止。

尽量不要在 popup 页面的 js 空间变量中保存数据。

### options_page

**拓展的选项页，在这里可以进行一些插件的数据保存。**

本地存储建议用`chrome.storage`而不是普通的`localStorage`

- `chrome.storage`是针对插件全局的，即使你在`background`中保存的数据，在`content-script`也能获取到, 而 localStorage 受域限制。
- `chrome.storage.sync`可以跟随当前登录用户自动同步，这台电脑修改的设置会自动同步到其它电脑，很方便，如果没有登录或者未联网则先保存到本地，等登录了再同步至网络
- _通过声明_`unlimitedStorage`_权限，谷歌拓展和应用可以突破_ `localStoarage`_5MB 大小限制_

`chrome.storage.sync`在断网情况下和`chrome.storage.local`基本没区别。

```
getStorage () {
  chrome.storage.local.get(['userGestureList'], (res) => {
    const raw = res.userGestureList || '[]'
    raw !=='[]' && (this.gestureSets = JSON.parse(raw))
    console.log(this.gestureSets)
  })
},
  saveStorage () {
    const userGestureList = this.gestureSets.length === 0 ? [] : this.gestureSets
    chrome.storage.local.set({'userGestureList': JSON.stringify(userGestureList)}, () => {
      this.getStorage ()
    })
  }
```

### content_scripts

**操作用户正在浏览的页面**

- `matches`: 匹配地址， <all_urls>则是匹配所有地址
- `css/js`: 注入的 css/js，注意 css 的注入是否影响全局样式
- `run_at`：代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认为 document_idle
- `all_frames`：定义脚本是否会注入到嵌入式框架中
- `exclude_matches`: 不匹配
- `include_globs / exclude_globs`:全局匹配/不匹配

`content_scripts`中的脚本只是共享页面的 DOM，而并不共享页面内嵌 JavaScript 的命名空间。

`content_scripts`中权限有限，例如在需要操作 tab 时候，就只能通过通信（一般和 background 进行通信）来实现

### background

**常驻后台**

```
    {
        // 2种指定方式，如果指定JS，那么会自动生成一个背景页
        "page": "background.html"
        //"scripts": ["js/background.js"]
    },
```

### web_accessible_resources

**能够直接访问的插件资源列表**

想要在 web 中直接访问插件中的资源的话必须显示声明

### [**Content Security Policy**](https://cn.vuejs.org/v2/guide/installation.html#CSP-环境)

VUE 完全支持 gsp 内容安全策略，CSP 的主要目的是防止跨站脚本攻击（XSS），

如果不在 CSP 声明的合法范围内，浏览器会拒绝引用这些资源，这点使用 vue 开发不需要担心。

**chrome 不允许扩展中的 HTML 页面内直接内嵌 js 脚本，而要求所有的脚本都作为外部 src 来引入**

### 引入方式：

```
// √
<script src="js/my_ip.js"></script>
// ×
<input onclick />

```

### permissions

**权限申请**

- storage：插件本地存储
- notifications： 桌面通知
- tabs：标签
- bookmarks：书签

```
sendInfo () {
  chrome.notifications.create(null, {
    type: 'image',
    iconUrl: chrome.extension.getURL('assets/up.png'),
    title: '今日诗词',
    message: '',
    imageUrl: 'https://v2.jinrishici.com/one.svg'
  })
}
```

**权限对比**

| JS 种类        | 可访问的 API                           | DOM 访问情况 | JS 访问情况 | 直接跨域 |
| -------------- | -------------------------------------- | ------------ | ----------- | -------- |
| content script | 只能访问 extension、runtime 等部分 API | 可以访问     | 不可以      | 不可以   |
| popup js       | 可访问绝大部分 API，除了 devtools 系列 | 不可直接访问 | 不可以      | 可以     |
| background js  | 可访问绝大部分 API，除了 devtools 系列 | 不可直接访问 | 不可以      | 可以     |

### 其他属性

- manifest_version： 清单规范版本
- name: 插件名称
- version： 插件版本
- icons：插件图标，偷懒都用一个大小也行
- description: 插件描述

## 通信

**content_scripts**

```
G_leftTab () {
  chrome.runtime.sendMessage({action: 'G_leftTab'}, (res) => {
    console.log(res)
  })
},
```

**bakcground**

```
<script>
  ...
  mounted () {
    const that = this
    chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
      console.log('sender', sender)
      if(message.action){
        that[message.action](sender)
        sendResponse(`done with ${message.action}`)
      }
    })
  },
  methods: {
    G_leftTab (sender) {
      let tabId = sender.tab.id,
          tabIndex = sender.tab.index
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        const totalTabLength = tabs.length
        chrome.tabs.query({index: (tabIndex - 1) % totalTabLength}, (tabs) => {
          if (tabs.length) {
            let willActivateId = tabs[0].id
            chrome.tabs.update(willActivateId, {active: true});
          }
        })
      })
    },
  }
</script>
```

## 项目文件结构

```
│  .env.alpha
│  .gitignore
│  babel.config.js
│  package.json
│  README.md
│  vue.config.js
│  yarn.lock
│
├─public
│  └─assets
│      │  down.png
│      │  left.png
│      │  right.png
│      │  up.png
│      │
│      └─icon
│              icon_19.png
│              icon_38.png
│              icon_76.png
│              logo.png
│
└─src
    │  manifest.development.json
    │  manifest.production.json
    │
    ├─background
    │  │  index.html
    │  │  index.js
    │  │
    │  └─App
    │          App.vue
    │
    ├─content
    │      content.vue
    │      index.html
    │      index.js
    │      mixin.js
    │
    ├─options
    │  │  index.html
    │  │  index.js
    │  │
    │  └─App
    │          App.vue
    │
    └─popup
        │  index.html
        │  index.js
        │
        └─App
                        App.vue
```

## 备注

- 图标来源：[iconfont](https://www.iconfont.cn/)
- 开放接口：[今日诗词](https://www.jinrishici.com/)
- 一个不错的入门 demo: [《Chrome 插件开发全攻略》配套完整 Demo](https://github.com/sxei/chrome-plugin-demo)
- 文档推荐：

  - [Chrome 扩展及应用开发（首发版）](https://www.ituring.com.cn/book/details/1421)
  - [官网](https://developer.chrome.com/extensions/extension)
