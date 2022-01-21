<script>
export default {
  data () {
    return {

    }
  },
  mounted () {
    console.log(111)
    this.getWorkTime()
  },
  methods: {
    getWorkTime () {  
      var trs = [].slice.call(document.querySelectorAll('tr'), 1)
      var firstTrChildren=[].slice.call(document.querySelectorAll('tr')[0].children)
      var startTimeIndex=firstTrChildren.findIndex(item=>item.innerText==='启动时间')
         var endTimeIndex=firstTrChildren.findIndex(item=>item.innerText==='持续时间')
      var total = trs.reduce((pre, item) => {
        var date = item.children[startTimeIndex].innerText.split(' ')[0]
        var time = "1970/01/01 " + item.children[endTimeIndex].innerText + ' GMT'
        if (pre[date]) {
          pre[date] += Date.parse(time)
        } else {
          pre[date] = Date.parse(time)
        }
        return pre
      }, {}) 
       chrome.runtime.sendMessage({totolWorkTimes:JSON.stringify(total)});
       console.log({total})
    }
  }
}
</script>