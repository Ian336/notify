function setMyXMLHTTPRequest(isOpen = false, myData ) {
  XMLHttpRequest.prototype.openMyXMLHTTPRequest = isOpen
  XMLHttpRequest.prototype.myData = myData
  class myXMLHttpRequest extends XMLHttpRequest {
    constructor() {
      super()
    }
    get responseText() {
      if (this.openMyXMLHTTPRequest&&this.myData) {
          if (myData.isOpen&&this.responseURL.match(new RegExp(myData.url,'i'))) {
            return myData.replaceData
          }else{
            return  super.responseText
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
  
  e.data.myXMLHttpRequestData&&e.data.myXMLHttpRequestData.forEach(item=>{
    setMyXMLHTTPRequest(e.data.isOpenMyXMLHttpRequest,item)
  })


 

})