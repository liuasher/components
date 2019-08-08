/*
 * @Author: wuhaiwei 
 * @Date: 2018-10-23 17:27:19 
 * @Last Modified by: wuhaiwei
 * @Last Modified time: 2019-07-09 17:15:52
 */
/**
 * 封装axios 请求的拦截配置
 */
import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/index';
import axios from 'axios';
import store from '@/store/index';
import { serverUrl} from '@/assets/config/index';
import { isEmptyObj } from '@/assets/js/validation';
import { getToken, setToken, getSysToken, setSysToken, goLogin, randomData } from '@/assets/js/auth';


function interceptors(router,store){
  //本地调试需要使用 ticket 跟 IdCard
  if (process.env.NODE_ENV === 'development') {

    setSysToken('b12ca396975480052ec69982ba7ef83f');
    setToken('eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjQ0NTE0NTUsInN1YiI6ImY2OTQ5OTkxMDU0MTZmNjAuNTI1NzY3Mzg5MTk1Nzk2NDgwX2U5NjEwOTlkMGUyZjFkZjY2OWJiZjM1ODk5NjkyYTdhXzE1NjQ0NTE0NTU1NzYiLCJqdGkiOiIxNTY0NDUxNDU1NjQ0IiwiZXhwIjoxNTY0NzEwNjU1fQ.GOQhJbqjXOjykehn8VVVSF4MZgAQt0Dhr2e8p1uGx0w');
  }
   /**
   * 获取系统票据
   */
  CheckSysToken();
  /**
   * 路由拦截设置
   */
  router.beforeEach((to, from, next) => {
    const code = to.query.code;
    if (!isEmptyObj(code)) {
      // console.log(meta)
      store.commit('updateMenuIdAndBreadcrumb', code);
    }
    next();
  });
  
  // baseURL
  axios.defaults.baseURL = serverUrl;
  // 
  // axios.defaults.headers.common['identification'] = '';
  axios.defaults.headers.common['Authorization'] = 'Bearer_' + getToken();

  //http request 拦截器
  axios.interceptors.request.use(
    config => {
      if (getToken() && getSysToken()) {
        config.headers.identification = 'IdCard_' + getSysToken() + '_' + randomData;
      }
      if (getToken() && ((config.headers.common['Authorization'].replace('Bearer_', '')) != getToken())) {
        location.reload(false);
      }  
     

      // console.error(config,57)
      // if(config.url.indexOf('device/list') > -1) {
      //   let config_copy = utils.deepCopy(config)
      //   let tempArr1 = config_copy.url.split('?')
      //   let tempArr2 = serverUrl.split(':')
      //   config_copy.url = `${tempArr2[0]}/saas/info/device/list?${tempArr1[1]}`
        // console.error(config_copy,63)
      //   return config_copy
      // }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  // http response 拦截器
  axios.interceptors.response.use(
    response => {
      if (response.data.code == 1406 || response.data.code == 1405 ||  response.data.code == 1404 || response.data.code == 1403 || response.data.code == 20114|| response.code == 20114|| response.data.code ==1010211) {
        // 拦截器返回code异常的时候，单独处理cookie localStorage.removeItem('name');      
        goLogin();
      }
      return response;
    },
    error => {
      return Promise.reject(error);
    }
  );
}
function CheckSysToken() {
  if (getToken()) {
    if (!getSysToken()) {
      // const url = '/authc/cross/verify';
      // console.error(111)
      store.dispatch('getSsoVerify').then((res) => {
        store.dispatch('getMenuInfo').then((res) => {
          store.dispatch('getUserPermsInfo').then((res) => {
            new Vue({
              // i18n,
              router,
              store,
              render: h => h(App)
            }).$mount('#app'); 
          }).catch();
        }).catch();
      }).catch((err) => {
         console.error(err);
      });
    } else {
      // console.error(222)
      store.dispatch('getMenuInfo').then((res) => {
        store.dispatch('getUserPermsInfo').then((res) => {
          new Vue({
            // i18n,
            router,
            store,
            render: h => h(App)
          }).$mount('#app'); 
        }).catch();
      }).catch();
    }
  } else {
    goLogin();
  }
}

export default interceptors;
