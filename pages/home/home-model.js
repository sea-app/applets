import {Base} from '../../utils/base.js';

class Home extends Base{

  constructor(){
    // 调用基类的构造函数
    super();
  }

  // 获取轮播图
  getBannerData(id,callback){
    var params = {
      url:'banner/' + id,
      // sCallBack:function(res){
      //   callBack && callBack(res);
      // }
      sCallback:callback
    };
    this.request(params);
  }

  // 获取首页主题
  getThemeData(callback) {
    var params = {
      url: 'theme?ids=1,2,3',
      sCallback: callback
    };
    this.request(params);
  }

  // 获取新品商品
  getProductsData(callback){
    var param = {
      url: 'product/recent',
      sCallback: callback
    };
    this.request(param);
  }
}

export {Home};