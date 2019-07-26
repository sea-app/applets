// pages/product/product.js
import {Product} from 'product-model.js';
import {Cart} from '../cart/cart-model.js';
var product = new Product();
var cart = new Cart();

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
      this.setData({
        cartTotalCounts: cart.getCartTotalCounts(),
        product:res.data
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

  // 获取（商品详情、产品参数、售后保障）绑定的 "data-index"
  onTabsItemTap:function(event){
    var index = product.getDataSet(event,'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  onAddingToCartTap:function(event){
    this.addToCart();
    var counts = this.data.cartTotalCounts + this.data.productCount;
    this.setData({
      cartTotalCounts: counts
    });
  },

  // 将商品添加到购物车中
  addToCart:function(){
    var tempObj = {};
    var keys = ['id','name','main_img_url','price'];
    for(var key in this.data.product){
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }
    cart.add(tempObj,this.data.productCount);
  },

  // 跳转购物车页面
  onCartTap:function(event){
    wx.switchTab({
      url: '/pages/cart/cart'
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