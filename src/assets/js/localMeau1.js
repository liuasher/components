const menusLoc = {
  sysTypeId: 10,
  name: '绿米数据',
  code: 'vizSym',
  menus: [
    {
      level: 1,
      menuId: '1',
      menuName: '测试菜单一',
      code: 'testmenu',
      icon: 'md-home',
      parentCode: 'vizSym'
    },
    {
      level: 2,
      menuId: '1-1',
      menuName: '测试子菜单一',
      url: '/testmenu2',
      code: 'testmenu2',
      parentCode: 'testmenu'
    },
    {
      level: 3,
      menuId: '1-3',
      menuName: 'tab测试',
      url: '/tab1',
      code: 'tab1',
      parentCode: 'testmenu2'
    },
    {
      level: 1,
      menuId: '3',
      menuName: '子设备1',
      code: 'Device',
      icon: 'md-albums',
      parentCode: 'vizSym'
    },
    {
      level: 2,
      menuId: '3-1',
      menuName: '子设备管理',
      url: '/devManage',
      code: 'devManage',
      parentCode: 'Device'
    },
    {
      level: 2,
      menuId: '3-2',
      menuName: '类别管理',
      url: '/devSortManage',
      code: 'devSortManage',
      parentCode: 'Device'
    },
    {
      level: 2,
      menuId: '3-3',
      menuName: '模型值管理',
      url: '/devModelManage',
      code: 'devModelManage',
      parentCode: 'Device'
    },
    {
      level: 1,
      menuId: '4',
      menuName: '网关',
      code: 'Gateway',
      icon: 'ios-switch',
      parentCode: 'vizSym'
    },
    {
      level: 2,
      menuId: '4-1',
      menuName: '网关管理',
      url: '/gatewayManage',
      code: 'gatewayManage',
      parentCode: 'Gateway'
    },
    {
      level: 2,
      menuId: '4-2',
      menuName: '类别管理',
      url: '/gatewaySortManage',
      code: 'gatewaySortManage',
      parentCode: 'Gateway'
    },
    {
      level: 2,
      menuId: '4-3',
      menuName: '模型值管理',
      url: '/gatewayModelManage',
      code: 'gatewayModelManage',
      parentCode: 'Gateway'
    },
    {
      level: 1,
      menuId: '5',
      menuName: '云端',
      code: 'Cloud',
      icon: 'md-cloud',
      parentCode: 'vizSym'
    },
    {
      level: 2,
      menuId: '5-1',
      menuName: '云端管理',
      url: '/cloudManage',
      code: 'cloudManage',
      parentCode: 'Cloud'
    },
    {
      level: 1,
      menuId: '8',
      menuName: 'APP',
      code: 'App',
      icon: 'md-phone-portrait',
      parentCode: 'vizSym'
    },
    {
      level: 2,
      menuId: '8-1',
      menuName: 'APP管理',
      url: '/appManage',
      code: 'appManage',
      parentCode: 'App'
    },
    {
      level: 1,
      menuId: '6',
      menuName: '平台',
      code: 'Platform',
      icon: 'ios-cube',
      parentCode: 'vizSym'
    },
    {
      level: 2,
      menuId: '6-1',
      menuName: '平台管理',
      url: '/platformManage',
      code: 'platformManage',
      parentCode: 'Platform'
    },
    {
      level: 1,
      menuId: '7',
      menuName: '协调器程序SDK',
      code: 'Sdk',
      icon: 'logo-buffer',
      parentCode: 'vizSym'
    },
    {
      level: 2,
      menuId: '7-1',
      menuName: 'SDK管理',
      url: '/sdkManage',
      code: 'sdkManage',
      parentCode: 'Sdk'
    }
  ]
};

export default menusLoc;
