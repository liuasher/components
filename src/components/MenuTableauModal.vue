<template>
    <Modal v-model="isShow" :closable="false" :mask-closable="false" :width="900" class-name="vertical-center-modal">
        <p slot="header">
            tableau配置
        </p> 
        <Form ref="menuTableauForm" :model="menuTableauFormData" :label-width="120" :rules="ruleValidate">  
          <FormItem label="tableau用户名：" prop="tableauUserName" class="form-margin">
            <Input v-model="menuTableauFormData.tableauUserName" :rows="10" type="text" placeholder="必填tableau用户名" />
          </FormItem >  
           
          <FormItem
                v-for="(item, index) in menuTableauFormData.paramAtt" 
                :key="'first'+item.index"
                :label="'自定义配置 ' + item.index" 
                >
            <Row >
              <Col span="4">
               <Select v-model="item.tagId" style="width:120px">
                  <Option v-for="tag in tagListData" :value="tag.tagId+''" :key="tag.tagId">{{ tag.tagName }}</Option>
              </Select>
              </Col>  

              <Col span="14" offset="1"> 
                <Row v-for="(item2, index2) in item.tagParam"  :key="'second'+item2.index" >
                  <Col span="9">
                      <Input type="text" v-model="item2.key" placeholder="请输入属性名称..."></Input>
                  </Col>
                  <Col span="9" offset="1">
                      <Input type="text" v-model="item2.value" placeholder="请输入属性值..."></Input>
                  </Col>
                  <Col span="4" offset="1">
                      <Button @click="handleRemoveSecond(item.tagParam,index2)">删除属性</Button>
                  </Col>
                </Row> 
                  <Row style="margin-top:10px;">
                    <Col span="8" offset="8">
                        <Button type="dashed" long @click="handleAddSecond(item.tagParam)" icon="md-add">添加属性</Button>
                    </Col> 
                </Row>
              </Col>

                  <Col span="2" offset="1">
                      <Button @click="handleRemoveFirst(menuTableauFormData.paramAtt,index)">删除配置</Button>
                  </Col>
            </Row>
        </FormItem>

           <Row style="margin-top:10px;">
                    <Col span="8" offset="8">
                        <Button type="dashed" long @click="handleAddFirst(menuTableauFormData.paramAtt)" icon="md-add">添加配置</Button>
                    </Col> 
           </Row>

        </Form>  

        <div slot="footer" class="footer-button" >
            <Button type="primary" @click="onSave" >
                <span>确定</span>
            </Button>
            <Button class="ivu-btn-theme" @click="handleReset">
                <span>取消</span>
            </Button>
        </div>
    </Modal>
</template>
<script>
export default {
  name: 'MenuTableauModal',
  mounted() {},
  data() {
    return {
      ruleValidate: {
        tableauUserName: [
          { required: true, message: 'tableau用户名不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  props: ['isShowMenuTableauModal', 'menuTableauFormData', 'tagListData'],
  computed: {
    isShow: {
      get() {
        return this.isShowMenuTableauModal;
      },
      set() {}
    }
  },
  methods: {
    handleAddFirst(item) {
      let att = {
        index: item.length + 1,
        tagId: '',
        tagParam: []
      };
      item.push(att);
    },handleRemoveFirst(item,index){
      item.splice(index, 1);
    },
    handleAddSecond(item) {
      let att = {
        index: item.length + 1,
        key: '',
        value: ''
      };
      item.push(att);
    },
    handleRemoveSecond(item, index2) {
      item.splice(index2, 1);
    },
    handleReset() {
      this.$emit('hideMenuTableauModal', false);
    },
    onSave() {
      this.$refs['menuTableauForm'].validate(valid => {
        if (valid) { 
          let params = {
            sysMenuId: this.menuTableauFormData.sysMenuId,
            paramAtt: this.menuTableauFormData.paramAtt,
            tableauUserName: this.menuTableauFormData.tableauUserName
          };
          this.$emit('addOrupdateMenuTableau', params);
          this.handleReset();
        }
      });
    }
  }
};
</script>
<style lang='less'>
.form-margin {
  margin-bottom: 20px;
}
</style>
