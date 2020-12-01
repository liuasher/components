// MenuManagement
export default {
  // 菜单P管理_MenuManagement
  $MenuManagement: {
    menu_tree:'/sysMenu/getMenuTree', //获取树状数据 
    menu_add:'/sysMenu/add', //add
    menu_del:'/sysMenu/del', //del
    menu_update:'/sysMenu/update', //update
    menu_export:'/sysMenu/exportMenuExcel',//export
    menu_tableau_save:'/menuTableauMap/save',//addOrUpdate
    menu_tableau_getMap:'/menuTableauMap/getMenuTableauMapByMenuId',//get 
    tableau_report:'/menuTableauMap/getTableauReportByCode',//get 
    tableau_default_params:'/menuTableauMap/getTableauDefaultReportParams',//get     
  }
};