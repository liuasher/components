/* 
 * 各存储类，加密的封装
 */
import Cookie from 'js-cookie';
// import md5 from 'js-md5';

export function getCookie(key) {
  return Cookie.get(key);
}

export function setCookie(key, val, obj) {
  return Cookie.set(key, val, obj);
}

export function removeCookie(key, path) {
  return Cookie.remove(key, path);
}

export function getLocalStorage(key) {
  return localStorage.getItem(key);
}

export function setLocalStorage(key, val) {
  return localStorage.setItem(key, val);
}

export function removeLocalStorage(key) {
  return localStorage.removeItem(key);
}

// export function getPwd(val) {
//   return md5(val);
// }

export function getLanguage() {
  return Cookie.get('lang');
}

export function setLanguage(val) {
  return Cookie.set('lang', val);
}


