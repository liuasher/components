<template>
  <div class="select-search">    
    <div class="dashboard">

      <h4>无限滚动，在iview基础上做的调优</h4>
      <div>
        <my-cascader 
          filterable 
          :data="positions" 
          v-model="position" 
          @on-change="changePosition" 
          placeholder="..." 
          trigger="hover">
        </my-cascader>
      </div>

      <h4>滚动槽</h4>
      <div class="scroll-container">
        <my-scrollbar 
          class="scroll-block">
          <ul>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
            <li>1111111</li>
            <li>2222222</li>
            <li>3333333</li>
          </ul>
        </my-scrollbar>
      </div>

    </div>
  </div>
</template>
<script>


import myCascader from '@/components/cascader';

// import mockData from './mock';

export default {
  name: 'App',
  components: {
    myCascader,
  },
  data() {
    return {
      position: [],
      positions:[],

      data:[]
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
      // let data = mockData;
      // this.positions = data.result;
      // for (let item of this.positions) {
      //   item.label = item.title;
      //   item.value = item.positionId;
      //   for(let room of item.children) {
      //       room.label = room.title;
      //       room.value = room.positionId;
      //   }
      //   item.children.unshift({label: item.label,value: item.value});
      // }
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

<style lang="less">

.scroll-container{
  overflow: hidden;
  position: relative;
  height: 200px;
  
}


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
