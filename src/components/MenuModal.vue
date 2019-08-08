<template>
    <Modal v-model="isShow" :closable="false" :mask-closable="false" :width="400" class-name="vertical-center-modal">
        <p slot="header">
            {{menuModalTitle}}
        </p>

        <Form ref="menuForm" :model="menuFormData" :label-width="120" :rules="ruleValidate"> 
          <FormItem label="菜单层级：" v-if="needToChoiceLevel" class="form-margin">
            <RadioGroup v-model="menuLevel">
              <Radio label="same"> 
                  <span>同级</span>
              </Radio>
              <Radio label="son"> 
                  <span>子级</span>
              </Radio> 
          </RadioGroup>
          </FormItem> 
          <FormItem label="url：" prop="url" class="form-margin">
            <Input v-model="menuFormData.url" :rows="4" type="text" placeholder="选填url" />
          </FormItem>

          <FormItem label="菜单名称：" prop="menuName" class="form-margin">
            <Input v-model="menuFormData.menuName" :rows="4" type="text" placeholder="必填菜单名称" />
          </FormItem> 

          <FormItem label="英文菜单名称：" prop="menuEnName" class="form-margin">
            <Input v-model="menuFormData.menuEnName" :rows="4" type="text" placeholder="必填菜单名称" />
          </FormItem> 

          <FormItem label="菜单序号：" prop="sortNum" class="form-margin">
            <Input v-model="menuFormData.sortNum" :rows="4" type="number" placeholder="数值大排序在前" />
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
  name: "MenuModal",
  mounted() {},
  data() {
    return {
      menuLevel: "same",
      ruleValidate: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        menuEnName: [
          { required: true, message: "英文菜单名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  props: [
    "isShowMenuModal",
    "menuModalTitle",
    "menuFormData",
    "menuData",
    "needToChoiceLevel"
  ],
  computed: {
    isShow: {
      get() {
        return this.isShowMenuModal;
      },
      set() {}
    }
  },
  methods: {
    handleReset() { 
      this.menuLevel ="same";
      this.$emit("hideMenuModal", false);
    },
    onSave() {
      this.$refs["menuForm"].validate(valid => {
        if (valid) {
          if (this.menuModalTitle == "新增") {
            if (this.menuLevel == "same") {
              this.menuFormData["level"] = this.menuData.level;
              this.menuFormData["parentCode"] = this.menuData.parentCode;
              this.menuFormData["parentId"] = this.menuData.parentId;
            } else {
              this.menuFormData["level"] = this.menuData.level + 1;
              this.menuFormData["parentCode"] = this.menuData.code;
              this.menuFormData["parentId"] = this.menuData.id;
            } 
            let param = this.menuFormData;
            this.$emit("addMenu", param);
          } else {
            let params = {
              id: this.menuFormData.id,
              url: this.menuFormData.url,
              menuName: this.menuFormData.menuName,
              menuEnName: this.menuFormData.menuEnName,
              sortNum: this.menuFormData.sortNum
            };
            this.$emit("updateMenu", params);
          }
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
