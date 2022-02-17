<template>
  <div>背景页</div>
</template>

<script>
export default {
  name: 'background',
  data () {
    return {
      index: 1,
      timer: "",
      isOpen:true
    }
  },
  mounted () {

    // 默认就是开启疲劳通知
     chrome.storage.local.get(
        ['isOpen','notifyTime'],
        (res) => {
          //不支持`??`
          this.isOpen = res.isOpen === undefined ? true : res.isOpen
          if(this.isOpen&&res.notifyTime){
              this.startTime(res.notifyTime)
          }

        }
      )
    const that = this
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      
      console.log('sender', message, sender, sendResponse)
      if (message.totolWorkTimes) {
        chrome.storage.local.set({ totolWorkTimes: message.totolWorkTimes })
      }
      if(!message.isOpen){
        clearInterval(that.timer)
        that.index=1
        return 
      }
      if (message.isOpen&&message.notifyTime) {
        clearInterval(that.timer)
         that.index=1
        that.startTime(message.notifyTime)
      }
    })
  },
  methods: {
    startTime (val) {
      this.timer = setInterval(() => {
        console.log(this.index++, val)
        if (this.index % val === 0) {
          chrome.notifications.create('limitNotify', {
            type: 'image',
            iconUrl: chrome.extension.getURL('assets/icon/500.png'),
            title: '主人',
            message: '该休息一下了!!!',
            requireInteraction: true,
            imageUrl: '/assets/cat.png'
          })
        }
      }, 60000)
    },
  }
}
</script>
