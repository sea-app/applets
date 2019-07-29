import {Base} from 'base.js';
import {Config} from 'config.js';

class Address extends Base{
  constructor(){
    super();
  }

  // 将省市区拼接成一个详细地址
  setAddressInfo(res){
    var province = res.provinceName || res.province;
    var city = res.cityName || res.city;
    var country = res.countyName || res.country;
    var detail = res.detailInfo || res.detail;
    var totalDetail = city + country + detail;

    if (!this.isCenterCity(province)){
      totalDetail = province + totalDetail;
    }

    return totalDetail;
  }

  // 判断是否是直辖市
  isCenterCity(name){
    var centerCitys = ['北京市','天津市','上海市','重庆市'];
    var flag = centerCitys.indexOf(name) >= 0;
    return flag;
  }
  
  // 更新保存地址
  submitAddress(data,callBack){
    data = this._setUpAddress(data);
    var param = {
      url: 'address',
      type: 'POST',
      data: data,
      sCallback: callBack
    };
    this.request(param);
  }

  // 获取地址参数
  _setUpAddress(res){
    var formData={
      name: res.userName,
      province: res.provinceName,
      city: res.cityName,
      country: res.countyName,
      mobile: res.telNumber,
      detail: this.setAddressInfo(res)
    };
    return formData;
  }

  getAddress(callBack){
    var param = {
      url: 'address',
      sCallback:callBack
    };
    this.request(param);
  }
}

export {Address};