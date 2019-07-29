import {Config} from 'config.js';
import {Token} from 'token.js';

class Base{

  constructor(){
    this.baseRequestUrl = Config.resUrl;
  }

  // 当noRefech为true时，不做未授权重试机制
  request(params,noRefetch){
    var that = this;
    var url = this.baseRequestUrl + params.url;
    if(!params.type){
      params.type = 'GET';
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header:{
        'content-type' : 'application/json',
        'token':wx.getStorageSync('token')
      },
      success:function(res){
        // 获取http 返回的 状态码
        var code = res.statusCode.toString();
        // 获取状态码第一位数字
        var startChar = code.charAt(0);
        if(startChar == '2'){
          params.sCallback && params.sCallback(res.data);
        }
        else{
          // 如果Token过期或无效
          if(code == '401'){
            // 防止无限未授权重试
            if(!noRefetch){
              that._refetch(params);
            }
          }
          if(noRefetch){
            params.sCallback && params.sCallback(res.data);
          }
        }
      },
      fail:function(err){
        console.log(err);
      }
    })
  }

  // 获取token，并重新执行用户的请求
  _refetch(params){
    var token = new Token();
    token.getTokenFromServer((token)=>{
      this.request(params,true);
    });
  }

  // 获取元素上绑定的值
  getDataSet(event,key){
    return event.currentTarget.dataset[key];
  }
}

export {Base};