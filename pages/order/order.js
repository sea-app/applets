// pages/order/order.js
import {Cart} from '../cart/cart-model.js';
import {Address} from '../../utils/address.js';
import {Order} from 'order-model.js';
var order = new Order();
var cart = new Cart();
var address = new Address();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null    // 订单ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var from = options.from;
    if(from == 'cart'){
      this._fromCart(options.account);
    }
    if(from == 'order'){
      var id = options.id;
      this._fromOrder(id);
    }
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    // 点击左上角的返回,下单后，无论支付成功或失败，显示订单详情
    if (this.data.id) {
      this._fromOrder(this.data.id);
    }
  },

  // 下单
  _fromCart:function(account){
    var productsArr;
    // 获取商品总价
    this.data.account = account;
    // 获取订单的商品
    productsArr = cart.getCartDataFromLocal(true);
    this.setData({
      productsArr: productsArr,
      account: account,
      orderStatus: 0
    });

    // 获取收货地址，并绑定到html页面
    address.getAddress((res) => {
      if (res) {
        this._bindAddressInfo(res.data);
      }
    })
  },

  // 显示订单详情
  _fromOrder:function(id){
    if (id) {
      var that = this;
      // 下单后，无论支付成功或失败，显示订单详情
      order.getOrderInfoById(id, (data) => {
        that.setData({
          orderStatus: data.data.status,
          productsArr: data.data.snap_items,
          account: data.data.total_price,
          basicInfo: {
            orderTime: data.data.update_time,
            orderNo: data.data.order_no
          }
        });
        var addressInfo = data.data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
      })
    }
  },

  // 添加收货地址
  editAddress:function(event){
    // 小程序内置收货地址组件(能获取微信的存在的收货地址)
    var that = this;
    wx.chooseAddress({
      success:function(res){
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };
        that._bindAddressInfo(addressInfo);
        // 保存地址
        address.submitAddress(res,(flag)=>{
          if(flag.data.length == 0){
            that.showTips('操作提示','地址更新失败');
          }
        });
      }
    })
  },

  // 生成订单和付款（点击去付款）
  pay:function(){
    if(!this.data.addressInfo){
      this.showTips('下单提示','请填写收获地址');
      return;
    }
    if(this.data.orderStatus == 0){
      this._firstTimePay();
    }
    else{
      this._oneMoresTimePay();
    }
  },

  _firstTimePay:function(){
    var orderInfo = [];
    var procuctInfo = this.data.productsArr;
    for(let i=0; i<procuctInfo.length; i++){
      orderInfo.push({
        product_id: procuctInfo[i].id,
        count:procuctInfo[i].counts
      });
    }
    var that = this;
    // 支付分两步，第一步生成订单号，然后根据订单号支付
    order.doOrder(orderInfo,(data)=>{
      // 判断是否生成订单
      if(data.data.pass){
        // 更新订单状态
        var id = data.data.order_id;
        that.data.id = id;
        // that.data.fromCartFlag = false;
        // 开始支付
        that._execPay(id);
      }
      else{
        that._orderFail(data.data);
      }
    });
  },


  // 开始支付
  _execPay:function(id){
    var that = this;
    order.execPay(id, (statusCode)=>{
      // if(statusCode != 0){     支付功能未完成
      if (statusCode == 0) {      // 使用假判断使支付失败
        // 将已经下单的商品从购物车删除
        that.deleteProducts();
        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
        })
      }
    })
  },

  // 下单失败
  _orderFail:function(data){
    var nameArr = [];
    var name = '';
    var str = '';
    var pArr = data.pStatusArray;
    for(let i=0; i<pArr.length; i++){
      if(!pArr[i].haveStock){
        name = pArr[i].name;
        if(name.length > 15){
          name = name.substr(0,12) + '...';
        }
        nameArr.push(name);
        if(nameArr.length >= 2){
          break;
        }
      }
    }
    str += nameArr.join('、');
    if(nameArr.length > 2){
      str += ' 等';
    }
    str += ' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function(res){

      }
    })
  },

  // 将已经下单的商品从购物车删除
  deleteProducts:function(){
    var ids = [];
    var arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++){
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  },

  // 提示窗
  // title    string  标题
  // content  string  内容
  // flag     bool    是否跳转到“我的页面”
  showTips:function(title,content,flag){
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res){
        if(flag){
          wx.switcheTap({
            url: '/pages/my/my'
          });
        }
      }
    })
  },

  // 绑定地址
  _bindAddressInfo:function(addressInfo){
    this.setData({
      addressInfo: addressInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})