<!-- Version -->
<template>
  <div class="version marginRight10">
    <Select 
      v-model="version" 
      style="width:80px;" 
      @on-change="changeVersion">
      <Option 
        v-for="item in versions" 
        :value="item.value" 
        :key="item.value">
        {{ item.label }}
      </Option>
    </Select>
  </div>
</template>

<script>
  import { getLocalStorage, setLocalStorage } from '@/assets/js/storage.js';
  export default {
    name: 'Version',
    data() {
      return {
        versions: [
          { value: '1',label: 'CN' },
          { value: '2',label: 'EN' }
        ],
        version: getLocalStorage('version') || '1'   //1：CN 2：EN
      };
    },
    methods: {
      changeVersion(value) {
        setLocalStorage('version', value);
        window.location.reload();
        // if(value === '2'&&!getLocalStorage('lastDeskId')) return
        // this.getConfirmList(value)
      },       
    },
  };

</script>
<style lang='less' scoped>
  .version {
    position: relative;
  /deep/.ivu-select-selection {
      // background-color: #4B74FF;
      border-color: #4B74FF;
      color: #4B74FF;
      i {
        color: #4B74FF;
      }
    }
    &:after {
      display: none;
      content: '';
      position: absolute;
      top: 16px;
      right: -5px;
      width: 1px;
      height: 40%;
      background-color: #4B74FF;
    }
  }
</style>
