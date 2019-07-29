//app.js
import {Token} from 'utils/token.js';

App({
  // 打开小程序，先执行这个函数
  onLaunch:function(){
    var token = new Token();
    token.verify();
  }
})