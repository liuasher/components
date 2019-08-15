<template>
  <div class="select-search">    
    <div class="dashboard">
      <!-- 1.0 无限滚动 -->
      <!-- <div>
        <my-cascader 
          filterable 
          :data="positions" 
          v-model="position" 
          @on-change="changePosition" 
          placeholder="..." 
          trigger="hover">
        </my-cascader>
      </div> -->

      <!-- 2.0 模板插槽 -->
      <my-selecter
        :data="data">
        <div slot="xxxyyy" slot-scope="props">
          {{props.testProps}}
        </div>
      </my-selecter>

    </div>
  </div>
</template>
<script>


import myCascader from '@/components/cascader';
import mySelecter from '@/components/selecter';

import mockData from './mock';

export default {
  name: 'App',
  components: {
    myCascader,
    mySelecter
  },
  data() {
    return {
      position: [],
      positions:[],

      data:[{
        id: 1,
        value: {
          name: 'random-1-001',
          info: {
            time: '2018-12-03 12:45',
            type: 'default'
          }
        }
      },{
        id: 2,
        value: {
          name: 'random-2-002',
          info: {
            time: '2016-12-03 20:25',
            type: 'warning'
          }
        }
      },{
        id: 3,
        value: {
          name: 'random-3-003',
          info: {
            time: '2013-12-03 03:13',
            type: 'error'
          }
        }
      },{
        id: 4,
        value: {
          name: 'random-4-004',
          info: {
            time: '2010-12-03 08:26',
            type: 'success'
          }
        }
      }]
    };
  },
  watch: {

  },
  computed: {

  },
  created() {
    
  },
  mounted() {
    this.qyeryData();
  },
  methods: {

    qyeryData(){
      let data = mockData;
      this.positions = data.result;
      for (let item of this.positions) {
        item.label = item.title;
        item.value = item.positionId;
        for(let room of item.children) {
            room.label = room.title;
            room.value = room.positionId;
        }
        item.children.unshift({label: item.label,value: item.value});
      }
    },

    /** 一级选项滚动 */
    handleScrollTobottom(){
      console.log(1111111);
    },

    changePosition(){

    }

  }
};
</script>

<style lang="less" scoped>

.dashboard{
  background: #eef1f5;
  width: 600px;
  height: 400px;
  padding: 20px;
}
.cascader{
  display: flex;
  width: 400px;
  height: 200px;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
  overflow: hidden;
  .cascader-left{
    width: 0;
    flex-grow: 1;
    overflow-y: scroll;
    background: #fff;
  }
  .cascader-right{
    width: 0;
    flex-grow: 1;
    overflow-y: scroll;
    background: #fff;
  }
  ul{
    list-style: none;
    text-decoration: none;
    margin: 0;
  }
  li{
    padding: 7px 10px;
  }
  li:hover{
    background: #f3f3f3;
    color: #00c284;
    cursor: pointer;
  }
  .mask{
    position: absolute;
    background: rgba(255,255,255,.7);
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>
