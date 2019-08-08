/*
 * @Author: wuhaiwei
 * @Date: 2018-10-19 11:48:50
 * @Last Modified by: wuhaiwei
 * @Last Modified time: 2019-04-24 11:31:51
 */
/**
 * 配置开发环境地址
 */
// 本地环境
const local = {
  serverUrl: '//bg151.aqara.com/saas/viz', 
  // serverUrl: '//10.0.14.194:9600',
  loginUrl: '//192.168.3.198/saas/access',
  serverAllot: '//192.168.3.198/saas/access-center',
  serverUrlBas: '//192.168.3.198/saas/bas',
};
// 线上环境
const server = {
  serverUrl: `${window.location.origin}/saas/viz`, 
  loginUrl: `${window.location.origin}/saas/access`,
  serverAllot: `${window.location.origin}/saas/access-center`,
  serverUrlBas: `${window.location.origin}/saas/bas`,
};
const isDev = process.env.NODE_ENV === 'development';
export const loginUrl = isDev ? local.loginUrl : server.loginUrl;
export const serverUrl = isDev ? local.serverUrl : server.serverUrl; 
