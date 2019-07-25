import {Base} from '../../utils/base.js';

class Cart extends Base{
  constructor(){
    super();
    this._storageKeyName = 'cart';
  }

  // 添加商品到购物车
  // 如果之前没有这样的商品，则直接添加一条新的纪录，数量为counts
  // 如果有,则只将相应数量 + counts
  // item    obj  商品对象
  // counts  int  商品数目
  add(item,counts){
    var catData = this.getCartDataFromlOCAL();
    var isHasInfo = this._isHasThatOne(item.id,cartData);
    if(isHasInfo.index == -1){
      item.counts = counts;
      item.selectStatus = true; // 设置商品选中状态
      cartData.push(item);
    }
    else{
      cartData[isHasInfo.index].counts += counts;
    }
    wx.setStorageSync(this._storageKeyName,cartData);
  }

  // 从缓存中读取购物车的数据
  getCartDataFromLocal(){
    var res = wx.getStorageSync(this._storageKeyName);
    if(!res){
      res = [];
    }
    return res;
  }

  // 判断某个商品是否已经被添加到购物车中
  _isHasThatOne(id,arr){
    var item,result={index: -1};
    for(let i=0; i<arr.length; i++){
      item = arr[i];
      if(item.id == id){
        result = {
          index: i,
          data: item
        };
        break;
      }
    }
    return result;
  }
}