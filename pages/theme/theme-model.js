import {Base} from '../../utils/base.js';

class Theme extends Base{
  constructor(){
    super();
  }

  //获取主题下的商品列表
  getProductsData(id,callback){
    var param = {
      url: 'theme/' + id,
      sCallback: callback
    };
    this.request(param);
  }
}

export {Theme};