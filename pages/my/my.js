// pages/my/my.js
import {My} from 'my-model.js';
import {Address} from '../../utils/address.js';
import {Order} from '../order/order-model.js';
var my = new My();
var address = new Address();
var order = new Order();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadedAll: false  // 判断订单是否已经全部加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getAddressInfo();
    this._getOrders();
  },

  // 获取用户地址
  _getAddressInfo:function(){
    address.getAddress((res)=>{
      this.setData({
        addressInfo: res.data
      });
    });
  },

  // 获取用户订单
  _getOrders:function(callback){
    order.getOrders(this.data.pageIndex,(res)=>{
      var data = res.data;
      if(data.length > 0){
        this.data.orderArr.push.apply(this.data.orderArr,data);
        this.setData({
          orderArr: this.data.orderArr
        });
        callback && callback();
      }
      else{
        this.data.isLoadeAll = true;
      }
    })
  },

  // 显示订单具体详情
  showOrderDetailInfo:function(event){
    var id = order.getDataSet(event,'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    });
  },

  // 付款
  rePay:function(event){
    var id = order.getDataSet(event,'id');
    var index = order.getDataSet(event,'index');
    this._execPay(id,index);
  },

  _execPay:function(id,index){
    var that = this;
    order.execPay(id, (statusCode) => {
      // if(statusCode != 0){     支付功能未完成
      if (statusCode == 0) {      // 使用假判断使支付失败
        var flag = statusCode == 2;
        // 更新订单显示状态
        if(flag){
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }
        // 跳转到成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
        })
      }
      else{
        that.showTips('支付失败','商品已下架或库存不足');
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 第二次打开我的页面，如果有新订单，重新加载订单数据
    var newOrderFlag = order.hasNewOrder();
    if (newOrderFlag){
      this.refresh();
    }
  },

  // 加载订单数据
  refresh:function(){
    var that = this;
    this.data.orderArr = [];
    this._getOrders(()=>{
      that.data.isLoadedAll = false;    // 更新订单是否加载完全的的标志位
      that.data.pageIndex = 1;
      order.execSetStorageSync(false); // 更新是否有新订单的标志位
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 下拉更新数据
    if (!this.data.isLoadeAll) {
      this.data.pageIndex++;
      this._getOrders();
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})