import {Base} from '../../utils/base.js';

class Order extends Base{
  constructor(){
    super();
    this._storageKeyName = 'newOrder';
  }

  // 下定单
  doOrder(param,callback){
    var that = this;
    var allParams = {
      url: 'order',
      type: 'post',
      data: {products: param},
      sCallback: function(data){
        that.execSetStorageSync(true);  // 设置标志位（存在新的订单）
        callback && callback(data);
      }
    };
    this.request(allParams);
  }

  // 拉起微信支付
  // params
  // norderNumber   int   订单ID
  // return
  // callback       obj   回调方法
  // 返回参数： 0：商品缺货等原因导致订单不能支付
  //           1：支付失败或者支付取消
  //           2：支付成功
  execPay(orderNumber,callback){
    var allParams = {
      url: 'pay/pre_order',
      type: 'post',
      data: {id:orderNumber},
      sCallback: function(data){
        var timeStamp = data.timeStamp;
        if(timeStamp){    // 可以支付
          wx.requestPayment({ // 打开微信支付
            'timeStamp': timeStamp.toString,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signSign,
            success:function(){
              callback && callback(2);
            },
            fail: function(){
              callback && callback(1);
            }
          });
        }
        else {
          callback && callback(0);
        }
      }
    };
    this.request(allParams);
  }

  /*获得订单的具体内容*/
  getOrderInfoById(id, callback) {
    var that = this;
    var allParams = {
      url: 'order/' + id,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {

      }
    };
    this.request(allParams);
  }

  // 获取所有订单，pageIndex 从1开始
  getOrders(pageIndex,callback){
    var allParams = {
      url: 'order/by_user',
      data: {page: pageIndex},
      type: 'get',
      sCallback:function(data){
        callback && callback(data);
      }
    };
    this.request(allParams);
  }

  // 判断是否有新订单(生成新订单之后会设置缓存：{this._storageKeyName:'true'})
  hasNewOrder(){
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag == true;
  }

  // 本地缓存 保存/更新
  execSetStorageSync(data){
    wx.setStorageSync(this._storageKeyName,data);
  }

}

export{Order};