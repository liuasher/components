// 用户权限菜单，映射后台返回菜单
export default [
  {
    menuId: '1',
    menuName: '工作台',
    code: 'Workbench',
    icon: 'md-home',
    isShow: false,
    children: [
      {
        menuId: '1-1',
        menuName: '关系管理工作台',
        url: '/workbench',
        code: 'workbench',
        isShow: false,
      }
    ]
  },
  /*{
    menuId: '2',
    menuName: '元素管理',
    url: '/element',
    code: 'Element',
    icon: 'ios-cube',
    isShow: false
  },*/
  {
    menuId: '3',
    menuName: '子设备',
    code: 'Device',
    icon: 'md-albums',
    isShow: false,
    children: [
      {
        menuId: '3-1',
        menuName: '子设备管理',
        url: '/devManage',
        code: 'devManage',
        isShow: false,
      },
      {
        menuId: '3-2',
        menuName: '类别管理',
        url: '/devSortManage',
        code: 'devSortManage',
        isShow: false,
      },
    ]
  },
  {
    menuId: '4',
    menuName: '网关',
    code: 'Gateway',
    icon: 'ios-switch',
    isShow: false,
    children: [
      {
        menuId: '4-1',
        menuName: '网关管理',
        url: '/gatewayManage',
        code: 'gatewayManage',
        isShow: false,
      },
      {
        menuId: '4-2',
        menuName: '类别管理',
        url: '/gatewaySortManage',
        code: 'gatewaySortManage',
        isShow: false,
      },
    ]
  },
  {
    menuId: '5',
    menuName: '云端',
    code: 'Cloud',
    icon: 'md-cloud',
    isShow: false,
    children: [
      {
        menuId: '5-1',
        menuName: '云端管理',
        url: '/cloudManage',
        code: 'cloudManage',
        isShow: false,
      },
      /*{
        menuId: '5-2',
        menuName: '类别管理',
        url: '/cloudSortManage',
        code: 'cloudSortManage',
        isShow: false,
      },*/
    ]
  },
  {
    menuId: '8',
    menuName: 'APP',
    code: 'App',
    icon: 'md-phone-portrait',
    isShow: false,
    children: [
      {
        menuId: '8-1',
        menuName: 'APP管理',
        url: '/appManage',
        code: 'appManage',
        isShow: false,
      },
      /*{
        menuId: '8-2',
        menuName: '类别管理',
        url: '/appEleSortManage',
        code: 'appEleSortManage',
        isShow: false,
      },*/
    ]
  },
  {
    menuId: '6',
    menuName: '平台',
    code: 'Platform',
    icon: 'ios-cube',
    isShow: false,
    children: [
      {
        menuId: '6-1',
        menuName: '平台管理',
        url: '/platformManage',
        code: 'platformManage',
        isShow: false,
      },
     /* {
        menuId: '6-2',
        menuName: '类别管理',
        url: '/platformSortManage',
        code: 'platformSortManage',
        isShow: false,
      },*/
    ]
  },
  {
    menuId: '7',
    menuName: '协调器程序SDK',
    code: 'Sdk',
    icon: 'logo-buffer',
    isShow: false,
    children: [
      {
        menuId: '7-1',
        menuName: 'SDK管理',
        url: '/sdkManage',
        code: 'sdkManage',
        isShow: false,
      },
      /*{
        menuId: '7-2',
        menuName: '类别管理',
        url: '/sdkSortManage',
        code: 'sdkSortManage',
        isShow: false,
      },*/
    ]
  },
 
]