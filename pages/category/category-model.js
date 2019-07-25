import {Base} from '../../utils/base.js';

class Category extends Base{
  constructor(){
    super();
  }

  // 获取所有分类
  getCategoryType(callback){
    var param = {
      url: 'category/all',
      sCallback:callback
    };
    this.request(param);
  }

  // 获取某个分类的商品
  getProductsByCategory(id,callback){
    var param = {
      url: 'product/by_category?id=' + id,
      sCallback: callback
    };
    this.request(param);
  }
}

export {Category};