<template>
  <div>
    <el-button
      v-if="isMockDataBtn"
      type="text"
      @click="showDrawer"
      icon="el-icon-search"
      class="topTips"
      >mock一下</el-button
    >

    <el-drawer
      append-to-body
      size="40%"
      class="drawer"
      :visible.sync="drawer"
      :direction="direction"
      @close="sendPostMessage"
    >
      <el-table :data="tableData" size="mini">
        <el-table-column label="正则url" prop="regExp">
          <template v-slot="{ row }">
            <el-input
              size="mini"
              v-model="row.url"
              placeholder="请入匹配的url"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column width="100" type="expand" label="替换数据">
          <template v-slot="{ row }">
            <vue-json-editor
              v-model="row.replaceData"
              :show-btns="true"
              :mode="'code'"
              lang="zh"
              @json-change="onJsonChange"
              @json-save="onJsonSave"
              @has-error="onError"
            ></vue-json-editor>
          </template>
        </el-table-column>
        <el-table-column label="开关" prop="isOpen" width="50">
          <template v-slot="{ row }">
            <el-switch size="mini" v-model="row.isOpen"></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="70">
          <template slot="header">
            <el-button @click="addTableData" plain size="mini">添加</el-button>
          </template>
          <template v-slot="{ $index }">
            <el-button size="mini" @click="delTableData($index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import vueJsonEditor from 'vue-json-editor'
export default {
  data () {
    return {
      mapping: {
        jQery: 'jquery',
        Mock: 'mock',
        MockData: 'myXMLHttpRequest',
      },
      isMockDataBtn: false,
      tableData: [
        {
          url: '',
          replaceData: {},
          isOpen: false,
        },
      ],
      drawer: false,
      direction: 'rtl',
    }
  },
  components: {
    vueJsonEditor,
  },
  created(){
    this.setBaiduTitle()
  
  },
  mounted () {
    this.deleteADTitle()
    //file协议时计算敬业时长
    if (location.protocol === 'file:') {
      this.getWorkTime()
    }
    this.getStorage()
    // this.sendPostMessage('moutend')
    //mouted钩子发送消息一直监听不到
    window.addEventListener("load", () => {
      window.postMessage({
        isOpenMyXMLHttpRequest: true,
        myXMLHttpRequestData: JSON.parse(JSON.stringify(this.tableData)),
      })
    })
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message)
      if (message.isOpenMyXMLHttpRequest) {
        window.postMessage(
          {
            isOpenMyXMLHttpRequest: message.isOpenMyXMLHttpRequest,
            myXMLHttpRequestData: message.myXMLHttpRequestData,
          },
          '*'
        )
      }
      //添加依赖
      if (message.dependents) {
        this.clearAllDependents()
        this.isMockDataBtn = false
        message.dependents.forEach((item) => {
          this.addLoad(item)
          if (item === 'MockData') {
            this.isMockDataBtn = true
          }
        })
      }

    })
  },
  methods: {
    deleteADTitle(){
      //删除知乎
      if(location.href.includes("zhihu.com")){      
        document.getElementsByClassName('PageHeader')[0].style.display='none'

      }else if(location.href.includes("jianshu.com")){
        //删除简书
        document.querySelector('[title]').style.display='none'
      }
    },
    setBaiduTitle(){
       if(location.href.includes("baidu.com")){
         document.getElementById("su").value='学习一下'
       }
    },
    addTableData () {
      this.tableData.push({ url: "", replaceData: "", isOpen: false })
    },
    delTableData (index) {
      this.tableData.splice(index, 1)
    },
    getStorage () {
      chrome.storage.local.get(
        ['notifyTime', 'tasks', 'closeNotify', 'dependents', 'tableData'],
        (res) => {
          if (res.tableData) {
            this.tableData = res.tableData
          }
          if (res.dependents.length) {
            this.isMockDataBtn = false
            res.dependents.forEach((item) => {
              this.addLoad(item)
              if (item === 'MockData') {
                this.isMockDataBtn = true
              }
            })
          }
        }
      )
    },
    sendPostMessage (val) {
      console.log(val, {
        isOpenMyXMLHttpRequest: true,
        myXMLHttpRequestData: JSON.parse(JSON.stringify(this.tableData)),
      });

      window.postMessage({
        isOpenMyXMLHttpRequest: true,
        myXMLHttpRequestData: JSON.parse(JSON.stringify(this.tableData)),
      })
      this.setStorage({ tableData: this.tableData })
    },
    setStorage (value, callback = () => { }) {
      chrome.storage.local.set(value, function () {
        callback()
        console.log('设置', value)
      })
    },
    onJsonChange (value) {
      console.log('value:', value)
    },
    onJsonSave (value) {
      console.log('value:', value)
    },
    onError (value) {
      console.log('value:', value)
    },

    showDrawer () {
      this.drawer = !this.drawer
    },
    clearAllDependents () {
      Object.keys(this.mapping).forEach(item => {
        this.delLoad(item)
      })
    },
    addLoad (value) {
      let script = document.createElement('script')
      // script1.src = 'https://cdn.bootcss.com/jquery/3.2.1/jquery.js'
      script.src = chrome.extension.getURL('assets/' + this.mapping[value] + '.js')
      script.id = this.mapping[value]
      document.body.append(script)
      // document.head.insertBefore(script, document.head.firstChild)
      // script2.src =
      //   'https://cdn.bootcdn.net/ajax/libs/Mock.js/1.0.1-beta3/mock-min.js'
    },
    delLoad (value) {
      document.getElementById(this.mapping[value]) && document.getElementById(this.mapping[value]).remove()
    },
    getWorkTime () {
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
<style scoped>


.topTips {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999999;
}
.drawer {
  overflow: hidden;
}
</style>
