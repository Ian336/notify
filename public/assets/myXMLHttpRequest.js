function setMyXMLHTTPRequest(isOpen = false, myData = []) {
  XMLHttpRequest.prototype.openMyXMLHTTPRequest = isOpen
  XMLHttpRequest.prototype.myData = myData
  class myXMLHttpRequest extends XMLHttpRequest {
    constructor() {
      super()
    }
    get responseText() {
      if (this.openMyXMLHTTPRequest&&this.myData.length) {
      
        for (let item of this.myData) {
          if (item.isOpen&&this.responseURL.match(new RegExp(item.url,'i'))) {
            return item.replaceData
          }else{
            return  super.responseText
          }
        }
      } else {
        console.log('原生')
        return super.responseText
      }
    }
  }
  window.XMLHttpRequest = myXMLHttpRequest
}

window.setMyXMLHTTPRequest=setMyXMLHTTPRequest
window.addEventListener("message",function(e){
  console.log('接受的到了',e.data.isOpenMyXMLHttpRequest,e.data)
  setMyXMLHTTPRequest(e.data.isOpenMyXMLHttpRequest,e.data.myXMLHttpRequestData)
})