<template>
  <div id="main">
    <el-row>
      <el-col>
        <img src="/assets/icon/76.png" style="width: 30px; height: 30px" />
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-date-picker
          v-model="timeStart"
          type="date"
          placeholder="开始日期"
          style="width: 140px"
          @change="timeStartChange"
          size="mini"
        ></el-date-picker
        >至
        <el-date-picker
          v-model="timeEnd"
          size="mini"
          type="date"
          @change="timeEndChange"
          placeholder="结束日期"
          style="width: 140px; margin-right: 5px"
        ></el-date-picker>
        <el-button size="mini" type="primary" @click="getWokeTime">{{
          workTime
        }}</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px" type="flex">
      <el-col style="justify-content: space-between">
        <el-switch
          v-model="isOpen"
          size="mini"
          @change="isOpenNotify"
        ></el-switch
        >疲劳通知提醒
        <el-input-number
          size="mini"
          v-model="defaultNotifyTime"
          @change="notifyTimeChange"
          :min="1"
          :max="1000"
          placeholder="单位分钟"
        ></el-input-number>
        <el-button size="mini" @click="test()">测试一下</el-button>
        <el-switch
          v-model="isLoadMock"
          size="mini"
          @change="loadMockChange"
        ></el-switch>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-switch
          v-model="isOpenMyXMLHttpRequest"
          size="mini"
          @change="openMyXMLHttpRequestChagne"
        ></el-switch>
        <el-input v-model="myXMLHttpRequestData.url"></el-input>
        <el-input
          type="textarea"
          v-model="myXMLHttpRequestData.response"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px" type="flex">
      <el-col>
        Top5计划
        <el-input
          v-model="task"
          size="mini"
          style="width: 300px"
          @keyup.enter.native="addTask()"
        ></el-input>
        <el-button @click="addTask()" size="mini" style="display: inline-block"
          >添加</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-col>
          <span v-for="(item, index) in tasks" :key="item">
            {{ index + 1 }}、 {{ item }}

            <el-button @click="delTask(index)" size="mini" plain type="text"
              >X</el-button
            >
          </span>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { Message } from 'element-ui'
export default {
  name: 'popup',
  data() {
    return {
      myXMLHttpRequestData: {},
      isOpenMyXMLHttpRequest:false,
      isLoadMock: false,
      isOpen: true,
      timeStart: new Date().setDate(1),
      timeEnd: new Date().setDate(new Date().getDate() - 1),
      task: '',
      tasks: [],
      defaultNotifyTime: 60,
      workTime: '敬业时长',
      totolWorkTimes: {},
    }
  },
  mounted() {
    this.getChromeStorage()
  },
  methods: {
    openMyXMLHttpRequestChagne(value) {
      console.log('发送子类',{ isOpenMyXMLHttpRequest: value, myXMLHttpRequestData:[this.myXMLHttpRequestData]})
      this.sendMessageToContentScript({ isOpenMyXMLHttpRequest: value, myXMLHttpRequestData:[this.myXMLHttpRequestData]}, function(response) {
        console.log('来自content的回复：' + response)
      })
    },
    sendMessageToContentScript(message, callback) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
          if (callback) callback(response)
        })
      })
    },
    loadMockChange(value) {
      this.sendMessageToContentScript({ isload: value }, function(response) {
        console.log('来自content的回复：' + response)
      })
    },
    isOpenNotify(val) {
      this.setStorage({ isOpen: val })
      chrome.runtime.sendMessage({
        isOpen: val,
        notifyTime: this.defaultNotifyTime,
      })
    },
    timeEndChange(val) {
      this.workTime = '敬业时长'
    },
    timeStartChange(val) {
      this.workTime = '敬业时长'
    },
    getChromeStorage() {
      chrome.storage.local.get(
        ['notifyTime', 'tasks', 'closeNotify', 'isOpen'],
        (res) => {
          //不支持??
          this.isOpen = res.isOpen === undefined ? true : res.isOpen
          this.tasks = JSON.parse(res.tasks || '[]')
          this.defaultNotifyTime = res.notifyTime || 60
        }
      )
    },
    notifyTimeChange(value) {
      this.setStorage({ notifyTime: value })
      chrome.runtime.sendMessage({ notifyTime: value, isOpen: this.isOpen })
    },
    getWokeTime() {
      chrome.storage.local.get(['totolWorkTimes'], (res) => {
        var result = 0
        var total = JSON.parse(res.totolWorkTimes)
        for (let i in total) {
          if (new Date(i) >= this.timeStart && new Date(i) <= this.timeEnd) {
            result += total[i] - 9 * 3600000
          }
        }
        result =
          parseInt(result / 3600000) +
          'h' +
          parseInt((result % 3600000) / 60000) +
          'm'
        this.workTime = result
      })
    },
    addTask() {
      if (this.tasks.length > 4) {
        return Message('最多5个任务')
      }
      this.tasks.push(this.task)
      this.setStorage({ tasks: JSON.stringify(this.tasks) })
      this.task = ' '
    },
    delTask(index) {
      this.tasks.splice(index, 1)
      this.setStorage({ tasks: JSON.stringify(this.tasks) })
    },
    setStorage(value, callback = () => {}) {
      chrome.storage.local.set(value, function() {
        callback()
        console.log('设置', value)
      })
    },
    //跳转
    goToOption() {
      chrome.tabs.create({
        url: 'chrome-extension://gjlaanimncgijljdjiplobfeojalaaak/options.html',
      })
    },
    //发送
    test() {
      chrome.notifications.create('limitNotify', {
        type: 'image',
        iconUrl: chrome.extension.getURL('assets/icon/500.png'),
        title: '主人',
        message: '该休息一下了!!!',
        requireInteraction: true,
        imageUrl: '/assets/cat.png',
      })
    },
  },
}
</script>
<style>
#main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  text-align: center;
  width: 400px;
  height: 400px;
}
</style>
