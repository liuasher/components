<template>
    <span>
        <ul @scroll="handleOnScroll" v-if="data && data.length" :class="[prefixCls + '-menu']">
            <Casitem
                v-for="item in data"
                :key="getKey()"
                :prefix-cls="prefixCls"
                :data="item"
                :tmp-item="tmpItem"
                @click.native.stop="handleClickItem(item)"
                @mouseenter.native.stop="handleHoverItem(item)"></Casitem>
        </ul><Caspanel v-if="sublist && sublist.length" :prefix-cls="prefixCls" :data="sublist" :disabled="disabled" :trigger="trigger" :change-on-select="changeOnSelect"></Caspanel>
    </span>
</template>
<script>
    // import Casitem from './casitem.vue';
    // import Emitter from '../../mixins/emitter';
    // import { findComponentUpward, findComponentDownward } from '../../utils/assist';

    import Casitem from 'iview/src/components/cascader/casitem';
    import Emitter from 'iview/src/mixins/emitter';
    import { findComponentUpward, findComponentDownward } from 'iview/src/utils/assist';


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
            prefixCls: String
        },
        data () {
            return {
                tmpItem: {},
                result: [],
                sublist: [],
                
                /** 存储hover时，用来比较的对象 */
                comparator: null,
                /** 锁 handleTriggerItem */
                handleLocker: null,
                /** 锁 handleOnScroll */
                scrollLocker: null,
                isScroll: false,

                /** 是否需要优化 */
                needOptimize: false
            };
        },
        watch: {
            data () {
                this.sublist = [];
                this.needOptimize = this.data.length > 400;
            }
        },
        methods: {
            /** 规则：滚动完80ms后设置为完成 */
            handleOnScroll(){
                if (this.needOptimize === false) {
                    return;
                }
                this.isScroll = true;

                /** 一旦滚动，清空所有定时器 */
                if (this.handleLocker !== null) {
                    window.clearTimeout(this.handleLocker);
                    this.handleLocker = null;
                }
                if (this.scrollLocker !== null) {
                    window.clearTimeout(this.scrollLocker);
                    this.scrollLocker = this.comparator;
                }

                /** 仅为了标示一个状态 */
                this.scrollLocker = setTimeout(() => {  
                    this.scrollLocker = null;
                    console.log('    scroll callback', 'empty');
                    this.isScroll = false;
                    /** 强制刷新滚动之后的hover */
                    if (this.handleLocker === null) {
                        this.tmpItem = this.comparator;
                        this.handleTriggerItem(this.comparator, false, true);
                    } else {
                        this.tmpItem = this.comparator;
                    }
                    
                }, 400);
            },
            handleClickItem (item) {
                if (this.trigger !== 'click' && item.children && item.children.length) return;  // #1922
                this.handleTriggerItem(item, false, true);
            },
            handleHoverItem (item) {
                /** 数据过短，使用原来代码流程 */
                if (this.needOptimize === false) {
                    if (this.trigger !== 'hover' || !item.children || !item.children.length) return;
                    this.handleTriggerItem(item, false, true);
                    return;
                }

                /** 取消鼠标悬停的重复调用 */
                if (this.comparator !== item) {
                    this.comparator = item;
                } else {
                    return;
                }

                if (this.trigger !== 'hover' || !item.children || !item.children.length) return;  // #1922

                /** 如果已经调用过，就取消 */
                if (this.handleLocker !== null) {
                    window.clearTimeout(this.handleLocker);
                }
                /** 重新设置 */
                this.handleLocker = setTimeout(() => {  
                    if (this.isScroll === false) {
                        console.log('  hover call', item.title);
                        this.handleTriggerItem(item, false, true);
                        console.log('此cascader 事件经过优化');
                    }
                    this.handleLocker = null;
                }, 100);
                
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

                if (this.isScroll === true) {
                    return;
                }

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
            /** 如果数据过短，则不作优化处理 */
            this.needOptimize = this.data.length > 400;

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
