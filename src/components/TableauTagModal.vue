<template>
    <Modal v-model="isShow" :closable="false" :mask-closable="false" :width="800" :height="800" class-name="vertical-center-modal">
        <p slot="header">
            {{TableauTagModalTitle}}
        </p>

        <Form ref="tableauTagForm" :model="tableauTagFormData" :label-width="100" :rules="ruleValidate" :height="800"> 
          <FormItem label="标签层级：" v-if="needToChoiceLevel" class="form-margin">
            <RadioGroup v-model="tagLevel">
              <Radio label="same"> 
                  <span>同级</span>
              </Radio>
              <Radio label="son"> 
                  <span>子级</span>
              </Radio> 
          </RadioGroup>
          </FormItem>  

          <FormItem label="标签名称：" prop="tagName" class="form-margin">
            <Input v-model="tableauTagFormData.tagName" :rows="4" type="text" placeholder="必填标签名称" />
          </FormItem> 

          <FormItem label="标签value：" prop="tagValue" class="form-margin">
            <Input v-model="tableauTagFormData.tagValue" :rows="4" type="text" placeholder="必填标签value" />
          </FormItem> 


          <FormItem
                v-for="(item, index) in tableauTagFormData.tagAttArr" 
                :key="item.index"
                :label="'属性 ' + item.index" 
                >
            <Row>
                <Col span="9">
                    <Input type="text" v-model="item.key" placeholder="请输入属性名称..."></Input>
                </Col>
                <Col span="9" offset="1">
                    <Input type="text" v-model="item.value" placeholder="请输入属性值..."></Input>
                </Col>
                <Col span="4" offset="1">
                    <Button @click="handleRemove(index)">删除</Button>
                </Col>
            </Row>
        </FormItem>
        
        <FormItem>
            <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAdd" icon="md-add">添加属性</Button>
                </Col>
            </Row>
        </FormItem> 


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
  name: 'TableauTagModal',
  mounted() {},
  data() {
    return {
      tagLevel: 'same',

      ruleValidate: {
        tagName: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' }
        ],
        tagValue: [
          { required: true, message: '标签value不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  props: [
    'isShowTableauTagModal',
    'TableauTagModalTitle',
    'tableauTagFormData',
    'tableauTagData',
    'needToChoiceLevel'
  ],
  computed: {
    isShow: {
      get() {
        return this.isShowTableauTagModal;
      },
      set() {}
    }
  },
  methods: {
    handleRemove(index){
      this.tableauTagFormData.tagAttArr.splice(index, 1);
    },
    handleAdd(){
      let att ={
          index:this.tableauTagFormData.tagAttArr.length+1,
          key:'',
          value:''
      };
      this.tableauTagFormData.tagAttArr.push(att);
    },
    handleReset() { 
      this.tagLevel ='same';
      this.$emit('hideTableauTagModal', false);
    },
    onSave() {
      this.$refs['tableauTagForm'].validate(valid => {
        if (valid) {
          let params={};
          if (this.TableauTagModalTitle == '新增') {
            if (this.tagLevel == 'same') {
              this.tableauTagFormData['level'] = this.tableauTagData.level;
              this.tableauTagFormData['parentTagId'] = this.tableauTagData.parentTagId; 
            } else {
              this.tableauTagFormData['level'] = this.tableauTagData.level + 1;
              this.tableauTagFormData['parentTagId'] = this.tableauTagData.tagId; 
            } 
              params = this.tableauTagFormData;
          } else {
              params = {
              tagId: this.tableauTagFormData.tagId,
              tagValue: this.tableauTagFormData.tagValue,
              tagName: this.tableauTagFormData.tagName,
              tagAttArr:  this.tableauTagFormData.tagAttArr 
            }; 
          }
          params.tagAtt =  JSON.stringify(params.tagAttArr);
          this.$emit('addOrUpdateTableauTag', params);
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
