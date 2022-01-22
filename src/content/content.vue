<template>
  <div>
    <div>我是中国人</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  mounted() {
    console.log(333,  chrome.runtime, chrome)
    // this.getWorkTime()
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      
      let script1 = document.createElement('script')
      let script2 = document.createElement('script')
      let script3 = document.createElement('script')
      console.log(message)
      if(message.isOpenMyXMLHttpRequest){
       window.postMessage({isOpenMyXMLHttpRequest:message.isOpenMyXMLHttpRequest,
       myXMLHttpRequestData:message.myXMLHttpRequestData
       }, '*');
      }
      if (message.isload) {
        // script1.src = 'https://cdn.bootcss.com/jquery/3.2.1/jquery.js'
        script1.src =  chrome.extension.getURL('assets/jquery.js')
        script1.id='jQuery'
        document.body.appendChild(script1)
      
        // script2.src =
        //   'https://cdn.bootcdn.net/ajax/libs/Mock.js/1.0.1-beta3/mock-min.js'
        script2.src = chrome.extension.getURL('assets/mock.js')
          script2.id='mock'
        document.body.appendChild(script2)


         script3.src = chrome.extension.getURL('assets/myXMLHttpRequest.js')
          script2.id='myXMLHttpRequest'
        document.body.appendChild(script3)
     

      } else {
       document.getElementById('mock').remove()
       document.getElementById('jQuery').remove()
       document.getElementById('myXMLHttpRequest').remove()
      }
    })

  },
  methods: {
    getWorkTime() {
      var trs = [].slice.call(document.querySelectorAll('tr'), 1)
      var firstTrChildren = [].slice.call(
        document.querySelectorAll('tr')[0].children
      )
      var startTimeIndex = firstTrChildren.findIndex(
        (item) => item.innerText === '启动时间'
      )
      var endTimeIndex = firstTrChildren.findIndex(
        (item) => item.innerText === '持续时间'
      )
      var total = trs.reduce((pre, item) => {
        var date = item.children[startTimeIndex].innerText.split(' ')[0]
        var time =
          '1970/01/01 ' + item.children[endTimeIndex].innerText + ' GMT'
        if (pre[date]) {
          pre[date] += Date.parse(time)
        } else {
          pre[date] = Date.parse(time)
        }
        return pre
      }, {})
      chrome.runtime.sendMessage({ totolWorkTimes: JSON.stringify(total) })
      console.log({ total })
    },
  },
}
</script>
