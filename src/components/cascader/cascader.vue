<template>
    <div :class="classes" v-click-outside="handleClose">
        <div :class="[prefixCls + '-rel']" @click="toggleOpen" ref="reference">
            <input type="hidden" :name="name" :value="currentValue">
            <slot>
                <i-input
                    :element-id="elementId"
                    ref="input"
                    :readonly="!filterable"
                    :disabled="disabled"
                    :value="displayInputRender"
                    @on-change="handleInput"
                    :size="size"
                    :placeholder="inputPlaceholder"></i-input>
                <div
                    :class="[prefixCls + '-label']"
                    v-show="filterable && query === ''"
                    @click="handleFocus">{{ displayRender }}</div>
                <Icon type="ios-close-circle" :class="[prefixCls + '-arrow']" v-show="showCloseIcon" @click.native.stop="clearSelect"></Icon>
                <Icon :type="arrowType" :custom="customArrowType" :size="arrowSize" :class="[prefixCls + '-arrow']"></Icon>
            </slot>
        </div>
        <transition name="transition-drop">
            <Drop
                v-show="visible"
                :class="{ [prefixCls + '-transfer']: transfer }"
                ref="drop"
                :data-transfer="transfer"
                :transfer="transfer"
                v-transfer-dom>
                <div class="wrapper">
                    <!-- 滚动到底部的时候需要一个回调 -->
                    <Caspanel
                        v-show="!filterable || (filterable && query === '')"
                        ref="caspanel"
                        :prefix-cls="prefixCls"
                        :data="data"
                        :disabled="disabled"
                        @scroll-to-end="scrollToEnd"
                        :currentPage="currentPage"
                        :pageSize="pageSize"
                        :change-on-select="changeOnSelect"
                        :trigger="trigger">
                    </Caspanel>
                    <!-- <div class="footer">
                        <Page 
                            size="small" 
                            :total="data.length" 
                            @on-change="curentPageChange"
                            :page-size="pageSize"/>
                    </div> -->
                    <div 
                        :class="[prefixCls + '-dropdown']" 
                        v-show="filterable && query !== '' && querySelections.length">
                        <ul :class="[selectPrefixCls + '-dropdown-list']">
                            <li 
                                :key="index"
                                :class="[selectPrefixCls + '-item', {
                                    [selectPrefixCls + '-item-disabled']: item.disabled
                                }]"
                                v-for="(item, index) in querySelections"
                                @click="handleSelectItem(index)" v-html="item.display"></li>
                        </ul>
                    </div>
                    <ul 
                        v-show="(
                            filterable && 
                            query !== '' && 
                            !querySelections.length) || 
                            !data.length" 
                        :class="[prefixCls + '-not-found-tip']">
                        <li>
                            {{ localeNotFoundText }}
                        </li>
                    </ul>
                </div>
            </Drop>
        </transition>
    </div>
</template>
<script>
    import iInput from 'iview/src/components/input/input';
    import Drop from 'iview/src/components/select/dropdown';
    import Icon from 'iview/src/components/icon/icon';
    import Caspanel from './caspanel';
    import {directive as clickOutside} from 'v-click-outside-x';
    import TransferDom from 'iview/src/directives/transfer-dom';
    import { oneOf } from 'iview/src/utils/assist';
    import Emitter from 'iview/src/mixins/emitter';
    import Locale from 'iview/src/mixins/locale';
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    console.log(999999999999999);
    console.log(1111111);
    const prefixCls = 'ivu-cascader';
    const selectPrefixCls = 'ivu-select';
    console.log(1111111);
    export default {
        name: 'Cascader',
        mixins: [ Emitter, Locale ],
        components: { iInput, Drop, Icon, Caspanel },
        directives: { TransferDom, clickOutside }, //clickOutside
        props: {
            data: {
                type: Array,
                default () {
                    return [];
                }
            },
            value: {
                type: Array,
                default () {
                    return [];
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                },
                default () {
                    return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
                }
            },
            trigger: {
                validator (value) {
                    return oneOf(value, ['click', 'hover']);
                },
                default: 'click'
            },
            changeOnSelect: {
                type: Boolean,
                default: false
            },
            renderFormat: {
                type: Function,
                default (label) {
                    return label.join(' / ');
                }
            },
            loadData: {
                type: Function
            },
            filterable: {
                type: Boolean,
                default: false
            },
            notFoundText: {
                type: String
            },
            transfer: {
                type: Boolean,
                default () {
                    return !this.$IVIEW || this.$IVIEW.transfer === '' ? false : this.$IVIEW.transfer;
                }
            },
            name: {
                type: String
            },
            elementId: {
                type: String
            },
            pageSize: {
                type: Number,
                default: 100
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                selectPrefixCls: selectPrefixCls,
                visible: false,
                selected: [],
                tmpSelected: [],
                updatingValue: false,    // to fix set value in changeOnSelect type
                currentValue: this.value,
                query: '',
                validDataStr: '',
                isLoadedChildren: false,    // #950
                currentPage: 1,
                locker: null
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-show-clear`]: this.showCloseIcon,
                        [`${prefixCls}-size-${this.size}`]: !!this.size,
                        [`${prefixCls}-visible`]: this.visible,
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-not-found`]: this.filterable && this.query !== '' && !this.querySelections.length
                    }
                ];
            },
            showCloseIcon () {
                return this.currentValue && this.currentValue.length && this.clearable && !this.disabled;
            },
            displayRender () {
                let label = [];
                for (let i = 0; i < this.selected.length; i++) {
                    label.push(this.selected[i].label);
                }

                return this.renderFormat(label, this.selected);
            },
            displayInputRender () {
                return this.filterable ? '' : this.displayRender;
            },
            localePlaceholder () {
                if (this.placeholder === undefined) {
                    return this.$t('i.select.placeholder');
                } else {
                    return this.placeholder;
                }
            },
            inputPlaceholder () {
                return this.filterable && this.currentValue.length ? null : this.localePlaceholder;
            },
            localeNotFoundText () {
                if (this.notFoundText === undefined) {
                    return this.$t('i.select.noMatch');
                } else {
                    return this.notFoundText;
                }
            },
            querySelections () {
                let selections = [];
                function getSelections (arr, label, value) {
                    for (let i = 0; i < arr.length; i++) {
                        let item = arr[i];
                        item.__label = label ? label + ' / ' + item.label : item.label;
                        item.__value = value ? value + ',' + item.value : item.value;

                        if (item.children && item.children.length) {
                            getSelections(item.children, item.__label, item.__value);
                            delete item.__label;
                            delete item.__value;
                        } else {
                            selections.push({
                                label: item.__label,
                                value: item.__value,
                                display: item.__label,
                                item: item,
                                disabled: !!item.disabled
                            });
                        }
                    }
                }
                getSelections(this.data);
                selections = selections.filter(item => {
                    return item.label ? item.label.indexOf(this.query) > -1 : false;
                }).map(item => {
                    item.display = item.display.replace(new RegExp(this.query, 'g'), `<span>${this.query}</span>`);
                    return item;
                });
                return selections;
            },
            // 3.4.0, global setting customArrow 有值时，arrow 赋值空
            arrowType () {
                let type = 'ios-arrow-down';

                if (this.$IVIEW) {
                    if (this.$IVIEW.cascader.customArrow) {
                        type = '';
                    } else if (this.$IVIEW.cascader.arrow) {
                        type = this.$IVIEW.cascader.arrow;
                    }
                }
                return type;
            },
            // 3.4.0, global setting
            customArrowType () {
                let type = '';

                if (this.$IVIEW) {
                    if (this.$IVIEW.cascader.customArrow) {
                        type = this.$IVIEW.cascader.customArrow;
                    }
                }
                return type;
            },
            // 3.4.0, global setting
            arrowSize () {
                let size = '';

                if (this.$IVIEW) {
                    if (this.$IVIEW.cascader.arrowSize) {
                        size = this.$IVIEW.cascader.arrowSize;
                    }
                }
                return size;
            }
        },
        methods: {
            // 设置当前页面
            curentPageChange (val) {
                this.currentPage = val;
            },
            // 滚动到顶部或底部
            // 需要注意：当用户拖动滚动条的时候，得设置一个定时器，不然刷的太快
            scrollToEnd (type, el) {
                if (this.locker !== null) {
                    return;
                }
                this.locker = setTimeout(() => {
                    if (type === 'top') {
                        if (this.currentPage > 1) {
                            /** 56是两个额外li高度的偏移量 */
                            el.scrollTop = el.scrollHeight - el.clientHeight - 56;
                            this.currentPage = this.currentPage - 1;
                        }
                    } else if (type === 'bottom') {
                        const maxPage = Math.ceil(this.data.length / this.pageSize);
                        if (this.currentPage < maxPage) {
                            this.currentPage = this.currentPage + 1;
                            el.scrollTop = 5;
                        }
                    }
                    this.locker = null;
                }, 100);
            },
            clearSelect () {
                if (this.disabled) return false;
                const oldVal = JSON.stringify(this.currentValue);
                this.currentValue = this.selected = this.tmpSelected = [];
                this.handleClose();
                this.emitValue(this.currentValue, oldVal);
//                this.$broadcast('on-clear');
                this.broadcast('Caspanel', 'on-clear');
            },
            handleClose () {
                this.visible = false;
            },
            toggleOpen () {
                if (this.disabled) return false;
                if (this.visible) {
                    if (!this.filterable) this.handleClose();
                } else {
                    this.onFocus();
                }
            },
            onFocus () {
                this.visible = true;
                if (!this.currentValue.length) {
                    this.broadcast('Caspanel', 'on-clear');
                }
            },
            updateResult (result) {
                this.tmpSelected = result;
            },
            updateSelected (init = false, changeOnSelectDataChange = false) {
                // #2793 changeOnSelectDataChange used for changeOnSelect when data changed and set value
                if (!this.changeOnSelect || init || changeOnSelectDataChange) {
                    this.broadcast('Caspanel', 'on-find-selected', {
                        value: this.currentValue
                    });
                }
            },
            emitValue (val, oldVal) {
                if (JSON.stringify(val) !== oldVal) {
                    this.$emit('on-change', this.currentValue, JSON.parse(JSON.stringify(this.selected)));
                    this.$nextTick(() => {
                        this.dispatch('FormItem', 'on-form-change', {
                            value: this.currentValue,
                            selected: JSON.parse(JSON.stringify(this.selected))
                        });
                    });
                }
            },
            handleInput (event) {
                this.query = event.target.value;
            },
            handleSelectItem (index) {
                const item = this.querySelections[index];

                if (item.item.disabled) return false;
                this.query = '';
                this.$refs.input.currentValue = '';
                const oldVal = JSON.stringify(this.currentValue);
                this.currentValue = item.value.split(',');
                // use setTimeout for #4786, can not use nextTick, because @on-find-selected use nextTick
                setTimeout(() => {
                    this.emitValue(this.currentValue, oldVal);
                    this.handleClose();
                }, 0);
            },
            handleFocus () {
                this.$refs.input.focus();
            },
            // 排除 loading 后的 data，避免重复触发 updateSelect
            getValidData (data) {
                function deleteData (item) {
                    const new_item = Object.assign({}, item);
                    if ('loading' in new_item) {
                        delete new_item.loading;
                    }
                    if ('__value' in new_item) {
                        delete new_item.__value;
                    }
                    if ('__label' in new_item) {
                        delete new_item.__label;
                    }
                    if ('children' in new_item && new_item.children.length) {
                        new_item.children = new_item.children.map(i => deleteData(i));
                    }
                    return new_item;
                }

                return data.map(item => deleteData(item));
            }
        },
        created () {
            this.validDataStr = JSON.stringify(this.getValidData(this.data));
            this.$on('on-result-change', (params) => {
                // lastValue: is click the final val
                // fromInit: is this emit from update value
                const lastValue = params.lastValue;
                const changeOnSelect = params.changeOnSelect;
                const fromInit = params.fromInit;

                if (lastValue || changeOnSelect) {
                    const oldVal = JSON.stringify(this.currentValue);
                    this.selected = this.tmpSelected;

                    let newVal = [];
                    this.selected.forEach((item) => {
                        newVal.push(item.value);
                    });

                    if (!fromInit) {
                        this.updatingValue = true;
                        this.currentValue = newVal;
                        this.emitValue(this.currentValue, oldVal);
                    }
                }
                if (lastValue && !fromInit) {
                    this.handleClose();
                }
            });
        },
        mounted () {
            this.updateSelected(true);
        },
        watch: {
            visible (val) {
                if (val) {
                    if (this.currentValue.length) {
                        this.updateSelected();
                    }
                    if (this.transfer) {
                        this.$refs.drop.update();
                    }
                    this.broadcast('Drop', 'on-update-popper');
                } else {
                    if (this.filterable) {
                        this.query = '';
                        this.$refs.input.currentValue = '';
                    }
                    if (this.transfer) {
                        this.$refs.drop.destroy();
                    }
                    this.broadcast('Drop', 'on-destroy-popper');
                }
                this.$emit('on-visible-change', val);
            },
            value (val) {
                this.currentValue = val;
                if (!val.length) this.selected = [];
            },
            currentValue () {
                this.$emit('input', this.currentValue);
                if (this.updatingValue) {
                    this.updatingValue = false;
                    return;
                }
                this.updateSelected(true);
            },
            data: {
                deep: true,
                handler () {
                    const validDataStr = JSON.stringify(this.getValidData(this.data));
                    if (validDataStr !== this.validDataStr) {
                        this.validDataStr = validDataStr;
                        if (!this.isLoadedChildren) {
                            this.$nextTick(() => this.updateSelected(false, this.changeOnSelect));
                        }
                        this.isLoadedChildren = false;
                    }
                }
            }
        }
    };
</script>
<style lang="less">
.footer{
    height: 30px;
    border-top: solid 1px #f6f6f6;
    border-right: solid 1px #f6f6f6;
    background: #fff;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}
.ivu-cascader-menu{
    overflow-y: auto;
    min-width: 220px;
    overflow-x: hidden;
}
.ivu-cascader-menu .ivu-cascader-menu-item{
    width: 220px;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space:nowrap; 
}
</style>

