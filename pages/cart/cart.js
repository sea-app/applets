// pages/cart/cart.js
import {Cart} from 'cart-model.js';
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载（只有第一次切换到这个页面才会执行这个函数）
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示(每一次切换页面都会执行这个函数)
   */
  onShow: function () {
    // 获取缓存中购物车的数据
    var cartData = cart.getCartDataFromLocal();
    // 根据购物车的数据，计算总价格，商品总数，商品种类数目
    var cal = this._calcTotalAccountAndCounts(cartData);
    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
      cartData: cartData
    });
  },

  // 根据购物车的数据，计算商品总价格，商品总数，商品种类数目
  _calcTotalAccountAndCounts:function(data){
    var len = data.length;
    // 计算购物车总价格，要排除掉未选中的商品
    var account = 0;
    // 购买商品的总个数
    var selectedCounts = 0;
    // 购买商品种类的总数
    var selectedTypeCounts = 0;
    let multiple = 100;
    for(let i=0; i<len; i++){
      if(data[i].selectStatus){
        // 乘以 multiple 是为了避免，直接使用浮点数计算，数据出现误差
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    }
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multiple * multiple)
    }
  },

  // 购物车中选择或取消选择商品
  toggleSelect:function(event){
    var id = cart.getDataSet(event,'id');
    var status = cart.getDataSet(event,'status');
    var index = this._getProductIndexById(id);
    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  // 购物车中全选商品
  toggleSelectAll:function(event){
    var status = cart.getDataSet(event,'status') == 'true';
    var data = this.data.cartData;
    var len = data.length;
    for(let i=0; i<len; i++){
      data[i].selectStatus = !status;
    }
    this._resetCartData();
  },

  // 将商品总价格，商品总数，商品种类数目；绑定到html页面
  _resetCartData:function(){
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    this.setData({
      account: newData.account,
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      cartData: this.data.cartData
    });
  },

  // 根据商品id得到商品所在的下标
  _getProductIndexById:function(id){
    var data = this.data.cartData;
    var len =data.length;
    for (let i=0; i<len; i++){
      if(data[i].id == id){
        return i;
      }
    }
  },

  // 增加或减少商品
  changeCounts:function(event){
    var id = cart.getDataSet(event,'id');
    var type = cart.getDataSet(event,'type');
    var index = this._getProductIndexById(id);
    var counts = 1;
    if(type == 'add'){
      cart.addCounts(id);
    }
    else{
      counts = -1;
      cart.cutCounts(id);
    }

    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  // 删除一个类别的商品
  delete:function(event){
    var id = cart.getDataSet(event,'id');
    var index = this._getProductIndexById(id);
    // 删除 this.data.cartData中 下标为index的商品数据
    this.data.cartData.splice(index,1);
    this._resetCartData();
    // 删除缓存中这个类别的商品
    cart.delete(id);
  },

  // 下单事件
  submitOrder:function(event){
    wx.navigateTo({
      // this.data.account（购物车总金额数），from=cart（在cart页面跳转的）
      url: '../order/order?account=' + this.data.account + '&from=cart'
    });
  },


  /**
   * 生命周期函数--监听页面隐藏(既离开页面)
   */
  onHide: function () {
    cart.execSetStorageSync(this.data.cartData);
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