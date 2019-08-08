import { LoadingBar, Message } from 'iview'
import axios from 'axios'

export default {
  get(url, data, excludeLoadProgress, config = {}) {
    let paramStr = '';
    Object.keys(data).forEach(key => {
      if (data[key] || data[key] === 0 || data[key] === '') {
        paramStr += key + '=' + data[key] + '&'
      }
    })
    if (paramStr !== '') {
      paramStr = paramStr.substr(0, paramStr.lastIndexOf('&'));
      url = url + '?' + paramStr;
    }
    return new Promise((resolve, reject) => {
      if (!excludeLoadProgress) LoadingBar.start();
      axios.get(url, config).then((res) => {
        res = res.data;
        if (res.code === 0) {
          if (!excludeLoadProgress) LoadingBar.finish();
          resolve(res);
        } else if (res.code === -1 || res.code === -100) {
          // -100：获取服务商身份信息失败
          if (!excludeLoadProgress) LoadingBar.error();
          Message.error({
            content: res.msg || '服务器忙碌，请稍后再试！',
            duration: 5
          });
          resolve(res)
        } else {
          if (!excludeLoadProgress) LoadingBar.error()
          resolve(res)
        }
      }, (err) => {
        err.result = '服务器繁忙！'
        reject(err)
      })
    });
  },
  post(url, params, excludeLoadProgress, config = {}) {
    return new Promise((resolve, reject) => {
      if (!excludeLoadProgress) LoadingBar.start();
      axios.post(url, params, config).then((res) => {
        res = res.data;
        if (res.code === 0) {
          if (!excludeLoadProgress) LoadingBar.finish();
          resolve(res);
        } else if (res.code === -1 || res.code === -100) {
          if (!excludeLoadProgress) LoadingBar.error();
          Message.error({
            content: res.msg || '服务器忙碌，请稍后再试！',
            duration: 5
          });
          resolve(res)
        } else {
          if (!excludeLoadProgress) LoadingBar.error()
          resolve(res)
        }
      }, (err) => {
        err.result = '服务器繁忙！'
        reject(err)
      })
    });
  }
}
