// pages/home/home.js

import {Home} from 'home-model.js';
var home = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(){
    this._loadData();
  },

  _loadData:function(){
    var id = 1;
    // 获取轮播图
    home.getBannerData(id, (res) => {
      this.setData({
        'bannerArr':res.data.relate_banner_item_model
      });
    });

    // 获取精选主题
    home.getThemeData((res)=>{
      this.setData({
        'themeArr':res.data
      });
    });

    // 获取新品商品
    home.getProductsData((res)=>{
      this.setData({
        'productsArr': res.data
      });
    });
  },

  // 轮播图页面/新品页面跳转
  onProductsItemTap:function(event){
    // var id = event.currentTarget.dataset.id;
    var id = home.getDataSet(event,'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    });
  },

  // 主题页面跳转
  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name
    });
  }
})