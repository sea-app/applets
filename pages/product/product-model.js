import {Base} from '../../utils/base.js';

class Product extends Base{
  constructor(){
    super();
  }

  getDetailInfo(id,callback){
    var param = {
      url: 'product/' + id,
      sCallback: callback
    };
    this.request(param);
  }
}

export {Product};