// pages/product/product.js
import {Product} from 'product-model.js';
var product = new Product();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    productCount:1,
    countsArray:[1,2,3,4,5],
    name:null,
    currentTabsIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取传递过来的id号
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },

  _loadData:function(){
    product.getDetailInfo(this.data.id,(res)=>{
      wx.setNavigationBarTitle({
        title: res.data.name
      });
      console.log(res.data);
      this.setData({
        product:res.data,
      });
    })
  },

  //pricker组件，获取选择的数值
  bindPickerChange:function(event){
    // 获取选择的参数，的下标
    var index = event.detail.value;
    // 根据下标获取，选择选择的参数
    var selectedCount = this.data.countsArray[index]
    this.setData({
      productCount: selectedCount
    });
  },

  onTabsItemTap:function(event){
    var index = product.getDataSet(event,'index');
    this.setData({
      currentTabsIndex: index
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