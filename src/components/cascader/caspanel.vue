<template>
    <span>
        <ul 
            v-scroll-to-end="handleOnScroll"
            v-if="data && data.length" 
            :class="[prefixCls + '-menu']">
            <Casitem
                v-for="item in filterData"
                :key="getKey()"
                :prefix-cls="prefixCls"
                :data="item"
                :tmp-item="tmpItem"
                @click.native.stop="handleClickItem(item)"
                @mouseenter.native.stop="handleHoverItem(item)">
            </Casitem>
        </ul>
        <Caspanel 
            v-if="sublist && sublist.length" 
            :prefix-cls="prefixCls" 
            :data="sublist" 
            :disabled="disabled" 
            :trigger="trigger" 
            :change-on-select="changeOnSelect">
        </Caspanel>
    </span>
</template>
<script>
    // import Casitem from './casitem.vue';
    // import Emitter from '../../mixins/emitter';
    // import { findComponentUpward, findComponentDownward } from '../../utils/assist';

    import Casitem from 'iview/src/components/cascader/casitem';
    import Emitter from 'iview/src/mixins/emitter';
    import { findComponentUpward, findComponentDownward } from 'iview/src/utils/assist';
    import scrollDirective from './directives';

    let key = 1;

    export default {
        name: 'Caspanel',
        mixins: [ Emitter ],
        components: { Casitem },
        props: {
            data: {
                type: Array,
                default () {
                    return [];
                }
            },
            disabled: Boolean,
            changeOnSelect: Boolean,
            trigger: String,
            prefixCls: String,
            currentPage: Number,
            pageSize: Number
        },
        directives: {
            scrollToEnd: scrollDirective
        },
        data () {
            return {
                tmpItem: {},
                result: [],
                sublist: [],
                
                /** 存储hover时，用来比较的对象 */
                comparator: null,
            };
        },
        watch: {
            data () {
                this.sublist = [];
            }
        },
        computed:{
            filterData(){
                if (!this.currentPage || !this.pageSize) {
                    /** 三级菜单不做处理 */
                    return this.data;
                } else {
                    let begin   = (this.currentPage - 1) * this.pageSize - 1;
                    let end     = this.currentPage * this.pageSize + 1;
                    // console.log('截取范围：', begin < 0 ? 0 : begin, end);
                    return this.data.slice(begin < 0 ? 0 : begin, end);
                }
            }
        },
        methods: {
            handleOnScroll(type, el){
                /** 通知父亲切换页面 */
                this.$emit('scroll-to-end', type, el);
            },
            handleClickItem (item) {
                if (this.trigger !== 'click' && item.children && item.children.length) return;  // #1922
                this.handleTriggerItem(item, false, true);
            },
            handleHoverItem (item) {
                /** 取消鼠标悬停的重复调用 */
                if (this.comparator !== item) {
                    this.comparator = item;
                } else {
                    return;
                }

                if (this.trigger !== 'hover' || !item.children || !item.children.length) return;
                this.handleTriggerItem(item, false, true);
            },
            handleTriggerItem (item, fromInit = false, fromUser = false) {
                if (item.disabled) return;

                const cascader = findComponentUpward(this, 'Cascader');
                if (item.loading !== undefined && !item.children.length) {
                    if (cascader && cascader.loadData) {
                        cascader.loadData(item, () => {
                            // todo
                            if (fromUser) {
                                cascader.isLoadedChildren = true;
                            }
                            if (item.children.length) {
                                this.handleTriggerItem(item);
                            }
                        });
                        return;
                    }
                }

                // return value back recursion  // 向上递归，设置临时选中值（并非真实选中）
                const backItem = this.getBaseItem(item);
                // #5021 for this.changeOnSelect，加 if 是因为 #4472

                if (
                    this.changeOnSelect ||
                    (backItem.label !== this.tmpItem.label || backItem.value !== this.tmpItem.value) ||
                    (backItem.label === this.tmpItem.label && backItem.value === this.tmpItem.value)
                ) {
                    this.tmpItem = backItem;
                    this.emitUpdate([backItem]);
                }

                if (item.children && item.children.length){
                    this.sublist = item.children;
                    this.dispatch('Cascader', 'on-result-change', {
                        lastValue: false,
                        changeOnSelect: this.changeOnSelect,
                        fromInit: fromInit
                    });

                    // #1553
                    if (this.changeOnSelect) {
                        const Caspanel = findComponentDownward(this, 'Caspanel');
                        if (Caspanel) {
                            Caspanel.$emit('on-clear', true);
                        }
                    }
                } else {
                    this.sublist = [];
                    this.dispatch('Cascader', 'on-result-change', {
                        lastValue: true,
                        changeOnSelect: this.changeOnSelect,
                        fromInit: fromInit
                    });
                }

                if (cascader) {
                    cascader.$refs.drop.update();
                }
            },
            updateResult (item) {
                this.result = [this.tmpItem].concat(item);
                this.emitUpdate(this.result);
            },
            getBaseItem (item) {
                let backItem = Object.assign({}, item);
                if (backItem.children) {
                    delete backItem.children;
                }

                return backItem;
            },
            emitUpdate (result) {
                if (this.$parent.$options.name === 'Caspanel') {
                    this.$parent.updateResult(result);
                } else {
                    this.$parent.$parent.updateResult(result);
                }
            },
            getKey () {
                return key++;
            }
        },
        mounted () {

            this.$on('on-find-selected', (params) => {
                const val = params.value;
                let value = [...val];
                for (let i = 0; i < value.length; i++) {
                    for (let j = 0; j < this.data.length; j++) {
                        if (value[i] === this.data[j].value) {
                            this.handleTriggerItem(this.data[j], true);
                            value.splice(0, 1);
                            this.$nextTick(() => {
                                this.broadcast('Caspanel', 'on-find-selected', {
                                    value: value
                                });
                            });
                            return false;
                        }
                    }
                }
            });
            // deep for #1553
            this.$on('on-clear', (deep = false) => {
                this.sublist = [];
                this.tmpItem = {};
                if (deep) {
                    const Caspanel = findComponentDownward(this, 'Caspanel');
                    if (Caspanel) {
                        Caspanel.$emit('on-clear', true);
                    }
                }
            });
        }
    };
</script>
