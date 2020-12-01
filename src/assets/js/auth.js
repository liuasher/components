import Cookies from 'js-cookie';
import md5 from 'js-md5';
const ticket = md5('ticket');
export const auth = md5('auth_IdCard');
export const localRead = (key) => {
  return localStorage.getItem(key) || 'zh-US';
};
export const randomData = new Date().getTime() + Math.floor(Math.random() * 90) + 10;
export function getToken() {
  return Cookies.get(ticket);
}

export function setToken(token) {
  return Cookies.set(ticket, token);
}

export function getSysToken() {
  return Cookies.get(auth);
}
//适用本地
export function setSysToken(sysToken) {
  return Cookies.set(auth, sysToken);
}

export function setLang(value) {
  return Cookies.set('lang', value);
}
export function getLang() {
  return Cookies.get('lang')||'zh-CN';
}

export function removeToken() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf('=');
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    name = name.replace(/^\s*|\s*$/, '');
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
  removeLocalStorage();
  Cookies.remove(auth, {
    path: '/information'
  });
  Cookies.remove(auth, {
    path: '/rms'
  });
  Cookies.remove(auth, {
    path: '/bas'
  });
  Cookies.remove(auth, {
    path: '/device'
  });
  Cookies.remove(auth, {
    path: '/retail'
  });
  Cookies.remove(auth, {
    path: '/viz'
  });
  return true;
}
// 现有版本处理，如每个系统自己存用户信息 该方法可以删除
export function removeLocalStorage() {
  localStorage.removeItem('userName');
  localStorage.removeItem('name');
  localStorage.removeItem('wecatNickName');
  localStorage.removeItem('imgUrl');
  localStorage.removeItem('birthday');
  localStorage.removeItem('gender');
  localStorage.removeItem('area');
  localStorage.removeItem('email');
  localStorage.removeItem('phoneNum');
  localStorage.removeItem('lastDeskId');
  localStorage.removeItem('version');
}

export function goLogin() {
  return window.location.href = window.location.origin + '/#/login/?callback=' + window.location.origin + window.location.pathname;
}

/**
	* 获取用户的权限菜单
	* @param {array} accessMenus 接口返回的用户菜单
	* @param {array} localMenus 本地菜单配置
	* @returns {array} 用户的权限菜单
*/
export function getMatchMenus(accessMenus = [], localMenus = []) {
  let matchMenus = [];

  // 匹配菜单
  for (let i = 0; i < accessMenus.length; i++) {
    if (accessMenus[i].parentId !== 1) {
      findTarget(localMenus, accessMenus[i].code);
    }
  }

  // 删除本地菜单配置中用户无权限菜单
  matchMenus = localMenus.filter(item => item.isShow).map(item => {
    for (let i = 0; i < item.children.length; i++) {
      if (!item.children[i].isShow) {
        item.children.splice(i, 1);
        i--;
      }
    }
    return item;
  });
  return matchMenus;
}
// 没权限跳转到提示页
export function nopermissions() {
  return window.location.href = window.location.origin + '/noper.html';
}



// 菜单的解析（二级菜单）
export function setMenu(localData, resData) {
  for (let i = 0; i < resData.length; i++) {
      if (resData[i].parentId !== 1) {
          findTarget(localData, resData[i].code);
      }
  }

  function findTarget(source, targetName) {
      if (source && source.length) {
          for (let item of source) {
              for (let i = 0; i < item.children.length; i++) {
                  if (item.children[i].code === targetName) {
                      item.children[i].isShow = true;
                      item.isShow = true;
                  }
              }
          }
      }
  }
  return localData;
}

