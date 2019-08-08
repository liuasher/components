/*
 * @Author: wuhaiwei
 * @Date: 2018-10-18 14:58:44
 * @Last Modified by: wuhaiwei
 * @Last Modified time: 2018-10-26 16:30:07
 */

import { LoadingBar, Message } from 'iview';
import axios from 'axios';
/**
 * 封装axios发送请求
 */
export default {
  /**
   * get请求
   * @param {访问地址} url
   * @param {请求数据} params
   * @param {默认true:有 loading 样式, false:没有 loading 样式} loading
   */
  get(url, params = {}, loading = true) {
    // let paramStr = "";
    // Object.keys(data).forEach(key => {
    //   if (data[key] || data[key] === 0 || data[key] === "") {
    //     paramStr += key + "=" + data[key] + "&";
    //   }
    // });
    // if (paramStr !== "") {
    //   paramStr = paramStr.substr(0, paramStr.lastIndexOf("&"));
    //   url = url + "?" + paramStr;
    // }
    return new Promise((resolve, reject) => {
      if (loading) {
        LoadingBar.start();
      }
      axios.get(url, { params: params }).then(
        res => {
          res = res.data;
          if (res.code === 0) {
            if (loading) {
              LoadingBar.finish();
            }
            resolve(res);
          } else {
            if (loading) {
              LoadingBar.error();
            }
            reject(res);
          }
        },
        err => {
          if (loading) {
            LoadingBar.error();
          }
          Message.error('网络异常');
          reject(err);
        }
      );
    });
  },
  /**
   * post请求
   * @param {访问地址} url
   * @param {请求数据} data
   * @param {默认true:有 loading 样式, false没有 loading 样式} loading
   */
  post(url, data = {}, loading = true) {
    return new Promise((resolve, reject) => {
      if (loading) {
        LoadingBar.start();
      }
      axios.post(url, data).then(
        res => {
          res = res.data;
          if (res.code == 0) {
            if (loading) {
              LoadingBar.finish();
            }
            resolve(res);
          } else {
            if (loading) {
              LoadingBar.error();
            }
            reject(res);
          }
        },
        err => {
          if (loading) {
            LoadingBar.error();
          }
          Message.error('网络异常');
          reject(err);
        }
      );
    });
  }
};
