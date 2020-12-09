
<template>
    <div class="el-calendar">
        <div class="el-calendar__hea-der">
            <div class="title">
                <span :class="type === 1 ? 'big-calendar' : 'small-calendar'">已授权日程（23）</span>
                <span class="calendar-detail"
                      @click="$emit('click-detail')"
                      v-if="type === 2">查看</span>
                <div class="el-calendar__button-group"
                     v-else>
                    <el-button-group>
                        <el-button type="plain"
                                   size="mini"
                                   @click="selectDate(SWITCH_TYPE.Prev)">
                            上个月
                        </el-button>
                        <el-button type="plain"
                                   size="mini"
                                   @click="selectDate(SWITCH_TYPE.Now)">
                            本月
                        </el-button>
                        <el-button type="plain"
                                   size="mini"
                                   @click="selectDate(SWITCH_TYPE.Next)">
                            下个月
                        </el-button>
                    </el-button-group>
                </div>
            </div>

        </div>

        <div class="calendar-table-big"
             v-if="type === 1"
             key="no-range">
            <date-table :date="date"
                        :type="type"
                        :selected-day="selectedDay"
                        :first-day-of-week="firstDayOfWeek"
                        :projects="lists"
                        :selected-id="selectedId"
                        @pick="pickDay"
                        @pointer="hoverProject"
                        @click="clickItem" />
        </div>
        <div v-else
             class="calendar-table-small"
             key="has-range">
            <date-table v-for="(range, index) in validatedRange"
                        :type="type"
                        :key="index"
                        :date="range[0]"
                        :selected-day="selectedDay"
                        :range="range"
                        :hide-header="index !== 0"
                        :first-day-of-week="firstDayOfWeek"
                        :projects="lists"
                        :selected-id="selectedId"
                        @pick="pickDay"
                        @pointer="hoverProject"
                        @click="clickItem" />
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import Locale from 'element-ui/src/mixins/locale';
import fecha from 'element-ui/src/utils/date';
import ElButton from 'element-ui/packages/button';
import ElButtonGroup from 'element-ui/packages/button-group';
import DateTable from './date-table';
import { validateRangeInOneMonth } from 'element-ui/src/utils/date-util';

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const oneDay = 86400000;

const SWITCH_TYPE = {
    Prev: 0,
    Now: 1,
    Next: 2
};

export default {
    name: 'ElCalendar',

    mixins: [Locale],

    data() {
        return {
            selectedDay: '',
            firstDayOfWeek: 1,
            now: new Date(),
            selectedId: ''
        };
    },

    components: {
        DateTable,
        ElButton,
        ElButtonGroup
    },

    props: {
        // 大小日历: 1大日历 2小日历
        type: {
            type: Number,
            default: 1
        },
        // 项目数据
        lists: {
            type: Array,
            default: () => []
        }
    },

    provide() {
        return {
            elCalendar: this
        };
    },

    willMount() {

    },

    mounted() {
        if (this.type === 1) {
            // 大日历
            this.$emit('switch', this.getMonthRange(this.now))
        } else {
            // 小日历
            const result = this.getRange()
            const targetStart = dayjs(result[0]).hour(0).minute(0).second(0).millisecond(0)
            const targetEnd = dayjs(result[1]).hour(23).minute(59).second(59).millisecond(59)
            this.$emit('switch', {
                start: targetStart,
                end: targetEnd
            })
        }
    },

    methods: {

        clickItem(projects, data) {
            this.$emit('click-item', projects, data)
        },

        hoverProject(projectId) {
            this.selectedId = projectId
        },

        // 设置选中的天
        pickDay(day) {
            this.$emit('switch', this.getMonthRange(day))
            this.selectedDay = day;
        },

        // 大日历在用
        getMonthRange(time) {
            // 月初月末还要转成 月初所在周的周一 月末所在周的周日
            const targetStart = dayjs(time).date(1).hour(0).minute(0).second(0).millisecond(0)
            const targetEnd = dayjs(time).add(1, 'month').date(0).hour(23).minute(59).second(59).millisecond(59)
            return {
                start: targetStart,
                end: targetEnd
            }
        },

        // 切换月份
        selectDate(type) {

            let day = '';
            if (type === SWITCH_TYPE.Prev) {
                day = `${this.prevMonthDatePrefix}-01`;
            } else if (type === SWITCH_TYPE.Next) {
                day = `${this.nextMonthDatePrefix}-01`;
            } else {
                day = this.formatedToday;
            }

            if (day === this.formatedDate) return;

            // 传参
            this.pickDay(day);
        },

        // 转换为时间
        toDate(val) {
            if (!val) {
                throw new Error('invalid val');
            }
            return val instanceof Date ? val : new Date(val);
        },

        // 
        getRange() {
            // 上周周一
            const rangeStart = dayjs(this.now).startOf('week').subtract(13, 'day').format('YYYY-MM-DD');
            // 本周周日
            const rangeEnd = dayjs(this.now).endOf('week').add(15, 'day').format('YYYY-MM-DD ');

            return [rangeStart, rangeEnd];
        },

        rangeValidator(date, isStart) {
            const firstDayOfWeek = this.firstDayOfWeek;
            const expected = isStart ? firstDayOfWeek : (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);
            const message = `${isStart ? 'start' : 'end'} of range should be ${weekDays[expected]}.`;


            if (date.getDay() !== expected) {
                console.warn('[ElementCalendar]', message, 'Invalid range will be ignored.');
                return false;
            }
            return true;
        },
    },

    computed: {

        // 选中 > 范围首天 > 此刻：它的意义是确定，我们要渲染的月份
        date() {
            if (this.selectedDay) {
                // 返回选中的日期
                const d = this.selectedDay.split('-');
                return new Date(d[0], d[1] - 1, d[2]);
            } else if (this.type === 2) {
                // 返回范围内第一天
                return this.validatedRange[0][0];
            }
            // 返回现在
            return this.now;
        },

        // 上个月的[年-月]
        prevMonthDatePrefix() {
            const temp = new Date(this.date.getTime());
            temp.setDate(0);
            return fecha.format(temp, 'yyyy-MM');
        },

        // 下个月的[年-月]
        nextMonthDatePrefix() {
            const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
            return fecha.format(temp, 'yyyy-MM');
        },

        // date格式化
        formatedDate() {
            return fecha.format(this.date, 'yyyy-MM-dd');
        },

        // data的描述
        dateLabel() {
            const year = this.date.getFullYear();
            const month = this.date.getMonth() + 1;
            return `${year} 年 ${month} 月`;
        },

        // now 的 yyyy-MM-dd格式
        formatedToday() {
            return fecha.format(this.now, 'yyyy-MM-dd');
        },



        // 二维数组，外层维度是周，内层是该周的起始
        validatedRange() {

            let range = this.getRange();
            if (!range) return [];
            range = range.reduce((prev, val, index) => {
                const date = this.toDate(val);
                if (this.rangeValidator(date, index === 0)) {
                    prev = prev.concat(date);
                }
                return prev;
            }, []);
            if (range.length === 2) {
                const [start, end] = range;
                if (start > end) {
                    console.warn('[ElementCalendar]end time should be greater than start time');
                    return [];
                }
                // start time and end time in one month
                if (validateRangeInOneMonth(start, end)) {
                    return [
                        [start, end]
                    ];
                }
                const data = [];
                let startDay = new Date(start.getFullYear(), start.getMonth() + 1, 1);
                const lastDay = this.toDate(startDay.getTime() - oneDay);
                if (!validateRangeInOneMonth(startDay, end)) {
                    console.warn('[ElementCalendar]start time and end time interval must not exceed two months');
                    return [];
                }
                // 第一个月的时间范围
                data.push([
                    start,
                    lastDay
                ]);
                // 下一月的时间范围，需要计算一下该月的第一个周起始日
                const firstDayOfWeek = this.firstDayOfWeek;
                const nextMontFirstDay = startDay.getDay();
                let interval = 0;
                if (nextMontFirstDay !== firstDayOfWeek) {
                    if (firstDayOfWeek === 0) {
                        interval = 7 - nextMontFirstDay;
                    } else {
                        interval = firstDayOfWeek - nextMontFirstDay;
                        interval = interval > 0 ? interval : 7 + interval;
                    }
                }
                startDay = this.toDate(startDay.getTime() + interval * oneDay);
                if (startDay.getDate() < end.getDate()) {
                    data.push([
                        startDay,
                        end
                    ]);
                }
                return data;
            }
            return [];
        },

        // ~
        SWITCH_TYPE() {
            return SWITCH_TYPE;
        }
    },




};
</script>
<style lang="less" scoped>
.title {
    display: flex;
    justify-content: space-between;
    .calendar-detail {
        color: #4e6def;
        cursor: pointer;
        font-size: 14px;
    }
    .calendar-detail:hover {
        color: #8097f5;
    }
    .big-calendar {
        font-size: 24px;
    }
    .small-calendar {
        font-size: 14px;
    }
}
.el-calendar {
    padding: 10px;
}
</style>