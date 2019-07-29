// pages/order/order.js
import {Cart} from '../cart/cart-model.js';
import {Address} from '../../utils/address.js';
var cart = new Cart();
var address = new Address();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productsArr;
    // 获取商品总价
    this.data.account = options.account;
    // 获取订单的商品
    productsArr = cart.getCartDataFromLocal(true);
    this.setData({
      productsArr: productsArr,
      account: options.account,
      orderStatus: 0
    });

    // 获取收货地址，并绑定到html页面
    address.getAddress((res)=>{
      if (res) {
        this._bindAddressInfo(res.data);
      }
    })
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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