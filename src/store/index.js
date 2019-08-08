import Vue from 'vue';
import Vuex from 'vuex';
import {
  loginUrl,
  serverUrl
} from '@/assets/config/index';
import axios from 'axios';
import Jsonp from 'jsonp';
import md5 from 'js-md5';
import {
  setCookie,
  getLocalStorage
} from '@/assets/js/storage.js';
import {
  nopermissions
} from '@/assets/js/auth.js';
import {
  getMenuTree
} from '@/assets/js/menuTree.js';
import localMeau from '@/assets/js/localMeau1.js';
import {
  getToken,
  getSysToken
} from '@/assets/js/auth';
import utils from '@/assets/js/utils.js';
import {
  Decrypt
} from '@/assets/js/cryptojs.js';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isDev: process.env.NODE_ENV == 'development',
    pageSize: 20,
    showMenu: false,
    curMenu: [],
    curInnerHeight: window.innerHeight - 89,
    userInfo: {},
    hasPowerAccount: '',
    selectedMenuId: '1-2',
    breadcrumbList: [{
      url: '',
      name: '绿米数据'
    }],
    accessMenus: [],
    accessMenusMap: {}
  },
  mutations: {
    updateMenuIdAndBreadcrumb: function (state, code) {
      let menus = state.accessMenus;
      let menu = null;
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].code == code) {
          menu = menus[i];
        }
      }
      // debugger
      if (menu === null) {
        return;
      }
      let menuIdAndBreadcrumb = {
        menuId: menu.menuId,
        breadcrumbList: [{
          url: menu.url,
          name: menu.name,
          code: menu.code
        }],
      };
      // commit('updateMenuIdAndBreadcrumb', menuIdAndBreadcrumb); 
      state.selectedMenuId = menuIdAndBreadcrumb.menuId;
      state.breadcrumbList = menuIdAndBreadcrumb.breadcrumbList;
    },
    updateInnerHeight: function (state, payload) {
      state.curInnerHeight = payload.innerHeight;
    },
    // updatePopTableData:function (state, value) {
    //   state.popTableData = value
    // }
    updateUserInfo: function (state, value) {
      state.userInfo = value;
    },
    updateShowMenu: function (state, value) {
      state.showMenu = value;
    },
    updateCurMenu: function (state, value) {
      state.curMenu = value;
    },
    updateHasPowerAccount: function (state, value) {
      state.hasPowerAccount = value;
    },
    updateAccessMenus: function (state, value) {
      state.accessMenus = value;
    },
    updateAccessMenusMap: function (state, value) {
      state.accessMenusMap = value;
    }
  },
  actions: {
    //处理票据的信息
    getSsoVerify({
      commit
    }) {
      return new Promise((resolve, reject) => {
        let url_path = '/authc/cross/verify';
        let path = '/viz';
        let timestamp = (new Date()).getTime();
        let cross = md5('cross:-saas_cors') + timestamp;
        let signature = md5(cross);
        let params = {
          signature: signature,
          timestamp: timestamp
        };
        const options = {
          name: 'crossVerify',
        };
        const translateParam = (data) => {
          let url = '';
          for (var k in data) {
            let value = data[k] !== undefined ? data[k] : '';
            url += `&${k}=${encodeURIComponent(value)}`;
          }
          // 删除第一个&
          return url ? url.substring(1) : '';
        };
        url_path += (url_path.indexOf('?') < 0 ? '?' : '&') + translateParam(params);
        // console.error(loginUrl+url_path);
        Jsonp(loginUrl + url_path, options, (err, res) => {
          // console.error(res, 72);
          if (res.code === 0) {
            let params = {
              license: res.data.license,
              timestamp: res.data.timestamp,
              ticket: res.data.ticket,
            };
            axios.post(`${serverUrl}/authc/cross/identification`, params).then((res) => {
              // console.error(res, 79);
              // console.error(auth);
              let auth = md5('auth_IdCard');
              // console.error(res, 80);
              if (res.data.code === 0) {
                setCookie(auth, res.data.authKey, {
                  path: path
                });
                // setCookie(auth, res.data.authKey);
                resolve();
              }
            }).catch((err) => {
              console.log(err, 1);
              reject();
            });

            // console.error(err,2)
          } else {
            console.log(err, 2);
            reject();
          }
        });
      });
    },
    /**
     * 获取 大数据可视化菜单列表信息
     */
    getMenuInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        const ticket = getSysToken(),
          timestamp = new Date().getTime() + Math.floor(Math.random() * 90) + 10,
          headers = {
            'identification': `IdCard_${ticket}_${timestamp}`,
            'Authorization': `Bearer_${getToken()}`
          };
        axios.get(`${serverUrl}/sysMenu/getMenuList`, {
          headers
        }).then(res => {
          res = res.data;
          if (res.code === 0) {
            localMeau.menus = JSON.parse(Decrypt(res.data));
            resolve();
          } else {
            nopermissions();
            reject();
          }
        }).catch((err) => {
          console.error(err, 194);
          reject();
        });
      });
    },
    /**
     * 获取用户权限信息
     */
    getUserPermsInfo({
      commit
    }) {

      const that = this;
      return new Promise((resolve, reject) => {
        const ticket = getSysToken(),
          timestamp = new Date().getTime() + Math.floor(Math.random() * 90) + 10,
          headers = {
            'identification': `IdCard_${ticket}_${timestamp}`,
            'Authorization': `Bearer_${getToken()}`
          };
        axios.get(`${serverUrl}/authc/get/privilege`, {
          headers
        }).then(res => {
          res = res.data;
          if (res.code === 0) {
            if (!res.perms) {
              commit('updateShowMenu', false);
              nopermissions();
              return;
            }
            if (res.user) {
              let user = res.user;
              if (user.avator == null) {
                user.avator = 'abc';
              }
              // this.avatorUrl = user.avator;
              // this.userName = user.nickName;
              // localStorage.setItem('imgUrl', user.avator);
              // localStorage.setItem('name', user.nickName);
              // localStorage.setItem('phoneNum', user.phoneNum);
              commit('updateUserInfo', user);
              setCookie('userId', user.userId);
            }
            localMeau.menus.sort(function (a, b) {
              if (a.sortNum > b.sortNum) {
                return -1;
              }
              if (a.sortNum < b.sortNum) {
                return 1;
              }
              if (a.sortNum == b.sortNum) {
                return 0;
              }

            });
            let accessMenus1 = utils.deepCopy(res.perms);
            let localMeaus = localMeau.menus;
            let map = {};
            let version = getLocalStorage('version');
            for (let g = 0; g < localMeaus.length; g++) {
              map[localMeaus[g]['code']] = localMeaus[g];
              localMeaus[g].menuName = version != '2' ? localMeaus[g].menuName : localMeaus[g].menuEnName;
            }
            let menusMap = {};
            for (let k = 0; k < accessMenus1.length; k++) {
              if (map[accessMenus1[k].code]) {
                if (map[accessMenus1[k].code].parentCode) {
                  accessMenus1[k].parentCode = map[accessMenus1[k].code].parentCode;
                }
                if (map[accessMenus1[k].code].menuId) {
                  accessMenus1[k].menuId = map[accessMenus1[k].code].menuId;
                }
                if (map[accessMenus1[k].code].menuName) {
                  //cn 1 en 2 
                  accessMenus1[k].name = map[accessMenus1[k].code].menuName;
                }
                accessMenus1[k]['sortNum'] = map[accessMenus1[k].code].sortNum;
                if (!menusMap[accessMenus1[k].parentCode]) {
                  menusMap[accessMenus1[k].parentCode] = [];
                }
                menusMap[accessMenus1[k].parentCode].push(accessMenus1[k]);
              }
            }
            commit('updateAccessMenusMap', menusMap);
            commit('updateAccessMenus', accessMenus1);

            let accessMenus = res.perms;
            let curMenu = getMenuTree(accessMenus, localMeau.menus, localMeau.code);
            commit('updateCurMenu', curMenu);
            let url = window.location.href;
            let index = url.indexOf('#');
            let after = url.substring(index + 2, url.length);
            if (after.length == 0) {
              // 一级菜单    
              for (let i in curMenu) {
                if (curMenu[i]) {
                  let temp = curMenu[i].childs;
                  // 二级菜单
                  for (let i in temp) {
                    if (temp[i].url) {
                      // 路由跳转，循环结束
                      let path = curMenu[0].childs[0].url;
                      window.location.href = url + path.slice(1) + '?code=' + curMenu[0].childs[0].code;
                      //  let menuIdAndBreadcrumb={
                      //     menuId: curMenu[0].childs[0].menuId,
                      //     breadcrumbList: [  {
                      //       url: curMenu[0].childs[0].url,
                      //       name: curMenu[0].childs[0].name,
                      //       code: curMenu[0].childs[0].code
                      //     }],
                      //   }
                      // commit('updateMenuIdAndBreadcrumb', menuIdAndBreadcrumb);
                    }
                  }
                }
              }
            }
            commit('updateShowMenu', true);
            // this.selectedMenuId = this.$store.state.selectedMenuId;
            resolve();
          } else {
            commit('updateShowMenu', false);
            nopermissions();
            reject();
          }
        }).catch((err) => {
          console.error(err, 194);
          reject();
        });
      });
    }
  },
  modules: {

  }
});