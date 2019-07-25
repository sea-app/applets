// pages/category/category.js
import {Category} from 'category-model.js';
var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenuIndex: 0,
    loadedData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData:function(){
    // 获取所有分类
    category.getCategoryType((data)=>{
      this.setData({
        categoryTypeArr: data.data
      });

      // 获取第一个分类的商品
      category.getProductsByCategory(data.data[0].id, (res) => {
        var dataObj = {
          procucts: res.data,
          topImgUrl: data.data[0].image.url,
          title: data.data[0].name
        };
        this.setData({
          categoryProducts: dataObj
        });

        this.data.loadedData[0] = dataObj;
      });
    });
  },

  // 获取某个分类的商品
  changeCategory: function (event) {
    var id = category.getDataSet(event, 'id');
    // 获取点击的分类，在所有分类数组里面的下标
    var index = category.getDataSet(event, 'index');
    // 获取某个分类的商品
    this.setData({
      currentMenuIndex: index
    });
    
    if(!this.isLoadedData(index)){
      // 如果没有加载过当前分类的商品数据
      category.getProductsByCategory(id, (res) => {
        var dataObj = {
          procucts: res.data,
          topImgUrl: this.data.categoryTypeArr[index].image.url,
          title: this.data.categoryTypeArr[index].name
        };
        this.setData({
          categoryProducts: dataObj
        });

        this.data.loadedData[index] = dataObj;
      });
    }
    else{
      // 已经加载过，直接读取
      this.setData({
        categoryProducts: this.data.loadedData[index]
      });
    }
  },

  // 跳转到商品详情
  onProductsItemTap:function(event){
    var id = category.getDataSet(event,'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    });
  },

  // 判断分类数据是否已经加载过了
  isLoadedData:function(index){
    if(this.data.loadedData[index]){
      return true;
    }
    return false;
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