import {Config} from 'config.js';

class Token{
  constructor(){
    this.verfyUrl = Config.resUrl + 'token/verify';
    this.tokenUrl = Config.resUrl + 'token/user';
  }

  verify(){
    var token =wx.getStorageSync('token');
    if(!token){
      this.getTokenFromServer();
    }
    else{
      this._veirfyFromServer(token);
    }
  }

  // 向服务器获取token
  getTokenFromServer(callBack){
    var that = this;
    wx.login({
      success:function(res){
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data:{
            code: res.code
          },
          success: function(res){
            wx.setStorageSync('token', res.data.data.token);
            callBack && callBack(res.data.data.token);
          }
        })
      },
      fail:function(err){
        console.log(err);
      }
    });
  }

  // 携带令牌去服务器校验令牌
  _veirfyFromServer(token){
    var that = this;
    wx.request({
      url: that.verfyUrl,
      method: 'POST',
      data: {
        token: token
      },
      success:function(res){
        var valid = res.data.data.isValid;
        if(!valid){
          that.getTokenFromServer();
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  }
}

export {Token};