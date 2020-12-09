<script>
import fecha from 'element-ui/src/utils/date';
import { range as rangeArr, getFirstDayOfMonth, getPrevMonthLastDays, getMonthDays, getI18nSettings, validateRangeInOneMonth } from 'element-ui/src/utils/date-util';
import dayjs from 'dayjs';
import Config from './config.ts'
const oneDay = 86400000;

// 创建一个矩阵对象
// 一起6行，每行最多20条数据

export default {
    props: {
        selectedDay: String, // formated date yyyy-MM-dd
        range: {
            type: Array,
            validator(val) {
                if (!(val && val.length)) return true;
                const [start, end] = val;
                return validateRangeInOneMonth(start, end);
            }
        },
        date: Date,
        hideHeader: Boolean,
        firstDayOfWeek: Number,
        // 项目数据
        projects: {
            type: Array,
            default: () => []
        },
        selectedId: String,
        type: Number
    },

    watch: {
        selectedDay() {
            this.Matrix = this.getMatrix()
        }
    },

    inject: ['elCalendar'],

    data() {
        return {
            WEEK_DAYS: getI18nSettings().dayNames,
            PresetColor: Config.PresetColor,
            Matrix: this.getMatrix()
        };
    },

    methods: {

        getMatrix() {
            const Matrix = {};
            for (let index = 0; index < 20; index++) {
                Object.defineProperty(Matrix, index, {
                    value: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false },
                });
            }
            return Matrix
        },

        toNestedArr(days) {
            return rangeArr(days.length / 7).map((_, index) => {
                const start = index * 7;
                return days.slice(start, start + 7);
            });
        },

        getFormateDate(day, type) {
            if (!day || ['prev', 'current', 'next'].indexOf(type) === -1) {
                throw new Error('invalid day or type');
            }
            let prefix = this.curMonthDatePrefix;
            if (type === 'prev') {
                prefix = this.prevMonthDatePrefix;
            } else if (type === 'next') {
                prefix = this.nextMonthDatePrefix;
            }
            day = `00${day}`.slice(-2);
            return `${prefix}-${day}`;
        },

        getCellClass({ text, type }) {
            const classes = [type, 'no-border-please'];
            if (type === 'current') {
                const date = this.getFormateDate(text, type);
                if (date === this.selectedDay) {
                    classes.push('is-selected');
                }
                if (date === this.formatedToday) {
                    classes.push('is-today');
                }
            }
            return classes;
        },

        pickDay({ text, type }) {
            const date = this.getFormateDate(text, type);
            this.$emit('pick', date);
        },
        // 当天是否为授权开始的那天
        isStart(project, date) {
            return project.startTime > date;
        },
        // 当天是否为授权结束的那天
        isEnd(project, date) {
            return project.endTime - oneDay < date;
        },
        // 是否显示content: 第一天要显示，开始天数比日历第一天还早的要显示
        hasContent(project, date, classes, { rowIndex, itemIndex }) {
            if (this.type === 2) {
                return false;
            }
            if (classes.indexOf('project-first') !== -1) {
                return true;
            } else if (rowIndex === 0 && itemIndex === 0 && !this.hideHeader) {
                return true;
            }
            return false;
        },
        // 显示tips内容
        getTips(project) {
            return `
                项目: ${project.projectName}
                开始: ${project.startTime}
                结束: ${project.endTime}
            `;
        },

        /**
         * 计算开始/结束占一行的百分比
         * @param {project} project  项目信息
         * @param {isStart} isStart  是计算开始，还是计算结束
         */
        getPercent(project, isStart) {
            if (isStart) {
                /**
                 * 计算开始百分比 00:00:00 ~ [proStart ~ 23:59:59]
                 */
                const proStart = project.startTime
                const todayEnd = dayjs(proStart).hour(23).minute(59).second(59).millisecond(59).valueOf()
                // 样式要用marginLeft，所以要计算当天到开始的空白
                const value = (oneDay - todayEnd + proStart) / oneDay;
                const target = Math.round(value * 100)
                return `${Math.min(target, 60)}%`
            } else {
                /**
                 * 计算结束百分比 [00:00:00 ~ proEnd] ~ 23:59:59
                 */
                const proEnd = project.endTime
                const todayStart = dayjs(proEnd).hour(0).minute(0).second(0).millisecond(0).valueOf()
                // 样式使用width，所以使用是当天到结束
                const value = (proEnd - todayStart) / oneDay;
                const target = Math.round(value * 100);
                return `${Math.max(target, 40)}%`
            }
        },

        /**
         * 元素内渲染每个project的方法
         * @param {project} project  项目
         * @param {timestamp} date  元素代表的日期
         * @param {number} rowIndex  每一行的索引
         * @param {number} itemIndex 一行内元素的索引
         * @param {number} projectIndex 元素内项目的索引
         */
        renderProject(project, date, indexGroup) {
            const { projectIndex } = indexGroup;

            // 先取出项目对应的颜色
            const BackgroundStyle = [{ backgroundColor: this.PresetColor[projectIndex] }]
            const MarginStyle = []
            // 用来区别头、身、尾 
            const HoverClass = [];
            const BorderClass = []
            const WrapBorderClass = []

            // calculateRowHitState

            // 设置命中行的状态
            if (project.startTime - oneDay <= date && date <= project.endTime) {
                if (this.isStart(project, date)) {
                    BorderClass.push('project-first');
                    WrapBorderClass.push('project-wrap-first');
                    MarginStyle.push({ marginLeft: this.getPercent(project, true) })
                }
                if (this.isEnd(project, date)) {
                    BorderClass.push('project-last');
                    WrapBorderClass.push('project-wrap-last');
                    MarginStyle.push({ width: this.getPercent(project, false) })
                }
                const hasContent = this.hasContent(project, date, BorderClass, indexGroup);
                const content = `（${indexGroup.projectIndex}）查看`


                if (projectIndex == this.selectedId) {
                    HoverClass.push('project-wrap-hover')
                }

                return <el-tooltip open-delay={600} class="item" effect="dark" placement="top">
                    <div slot="content">{this.getTips(project)}</div>
                    <span data-project-index={projectIndex} class={['project-wrap', WrapBorderClass, HoverClass]} style={MarginStyle}>
                        <span data-project-index={projectIndex} class={['project', BorderClass]} style={BackgroundStyle}>
                            {hasContent ? content : ''}
                        </span>
                    </span>
                </el-tooltip>;
            }

            // 设置空白行的状态
            return this.calculateRowEmptyState(project, date, indexGroup)
        },

        // 计算某一行项目的命中状态
        calculateRowHitState(project, date) {
            const { rowStart, rowEnd } = this.getWeekRange(date)
            const projectStartHit = rowStart < project.startTime
            const projectEndHit = project.endTime < rowEnd
            return {
                hitstart: projectStartHit,
                hitEnd: projectEndHit,
                content: `${projectStartHit ? '头命中' : ''} ${projectEndHit ? '尾命中' : ''}`
            }
        },

        /**
         * 传入当前天数，获取这天的周一开始 ~ 周日结束
         */
        getWeekRange(date) {
            const rowStart = dayjs(date).day(1).valueOf()
            const rowEnd = dayjs(date).day(7).hour(23).minute(59).second(59).millisecond(59).valueOf()
            return { rowStart, rowEnd }
        },

        /**
         * 格式化
         */
        format(date) {
            return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
        },

        // 计算本项目开始和下一个项目结束的关系
        calculateStartWithNextEnd(project, date, { projectIndex, rowIndex, itemIndex }) {

        },

        // 计算本项目结束和下一个项目开始的关系
        calculateEndWithNextStart(project, date, { projectIndex, rowIndex, itemIndex }) {

        },

        /**
         * 判断某一行的项目列表是否显示，如果某一行没有项目命中，该行就不显示
         * @param {number} rowIndex  每一行的索引
         * @param {number} itemIndex 一行内元素的索引
         * @param {number} projectIndex 元素内项目的索引
         */
        calculateRowEmptyState(project, date, { projectIndex, rowIndex, itemIndex }) {

            const defaultDom = <span class="project-wrap">
                <span class="project"></span>
            </span>

            // 小日历不作判断，由两个日历拼接，懒得维护变量
            if (this.type === 2) return defaultDom;

            // 每周的第一天开始计算
            if (itemIndex === 0) {
                const { rowStart, rowEnd } = this.getWeekRange(date)

                if (project.endTime < rowStart || rowEnd < project.startTime) {
                    // 如果这一行都是空白的
                    this.Matrix[projectIndex][rowIndex] = true
                    return <span class="project-wrap-?" >
                        <span class="project"></span>
                    </span>;
                }
            } else {
                // 如果不是第一个item 
                if (this.Matrix[projectIndex][rowIndex] === true) {
                    // 如果这一行都被标记为true (不显示)
                    return <span class="project-wrap-?" >
                        <span class="project"></span>
                    </span>;
                }
            }

            if (this.isStart(project, date)) {
                // 如果没有标注，如何本排和下一排没有啮合，可以合并
                // 无非两种情况（上面的结束了下面还没开始、下面的结束了上面还没开始）
                // 只需要在遇到[开始][结束]节点才需要计算
                return <span class="project-wrap" >
                    <span class="project"></span>
                </span>;
            }

            // if ([
            //     // '220', '221', '222', '123', '124', '125', '126',
            //     // '320', '321', '322', '323', '324', '225', '226',
            // ].indexOf(`${projectIndex}${rowIndex}${itemIndex}`) !== -1) {
            //     return <span class="project-wrap-?" >
            //         <span class="project"></span>
            //     </span>;
            // }

            return <span class="project-wrap" >
                <span class="project">{projectIndex} {rowIndex} {itemIndex}</span>
            </span>;
        },

        /**
         * 渲染日历中每个cell的方法，一个cell称为一个元素
         * @param {number} rowIndex  每一行的索引
         * @param {number} itemIndex 一行内元素的索引
         * @param {number} projectIndex 元素内项目的索引
         */
        cellRenderProxy({ text, type }, rowIndex, itemIndex) {
            const date = this.getFormateDate(text, type);
            const cellDate = dayjs(date).valueOf();
            return <div class="date-container">
                <div class="date-info">{text < 10 ? `0${text}` : text}</div>
                <div class="project-lists" onpointermove={(e) => this.handlePointerMove(e)} >
                    {
                        this.projects.map((project, projectIndex) => this.renderProject(project, cellDate, {
                            projectIndex, rowIndex, itemIndex
                        }))
                    }
                </div>
            </div>;
        },
        handleClick(e, { text, type }) {
            const target = e.target.dataset.projectIndex;
            if (target === undefined) return;
            const date = this.getFormateDate(text, type);
            e.stopPropagation()
            this.$emit('click', this.projects[target], date, { text, type });
        },
        handlePointerMove(e) {
            const target = e.target.dataset.projectIndex
            if (target === this.selectedId) {
                return
            }
            this.$emit('pointer', target)
        }
    },

    computed: {
        prevMonthDatePrefix() {
            const temp = new Date(this.date.getTime());
            temp.setDate(0);
            return fecha.format(temp, 'yyyy-MM');
        },

        curMonthDatePrefix() {
            return fecha.format(this.date, 'yyyy-MM');
        },

        nextMonthDatePrefix() {
            const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
            return fecha.format(temp, 'yyyy-MM');
        },

        formatedToday() {
            return this.elCalendar.formatedToday;
        },

        isInRange() {
            return this.range && this.range.length;
        },

        rows() {
            let days = [];
            // if range exists, should render days in range.
            if (this.isInRange) {
                const [start, end] = this.range;
                const currentMonthRange = rangeArr(end.getDate() - start.getDate() + 1).map((_, index) => ({
                    text: start.getDate() + index,
                    type: 'current'
                }));
                let remaining = currentMonthRange.length % 7;
                remaining = remaining === 0 ? 0 : 7 - remaining;
                const nextMonthRange = rangeArr(remaining).map((_, index) => ({
                    text: index + 1,
                    type: 'next'
                }));
                days = currentMonthRange.concat(nextMonthRange);
            } else {
                const date = this.date;
                let firstDay = getFirstDayOfMonth(date);
                firstDay = firstDay === 0 ? 7 : firstDay;
                const firstDayOfWeek = typeof this.firstDayOfWeek === 'number' ? this.firstDayOfWeek : 1;
                const prevMonthDays = getPrevMonthLastDays(date, firstDay - firstDayOfWeek).map(day => ({
                    text: day,
                    type: 'prev'
                }));
                const currentMonthDays = getMonthDays(date).map(day => ({
                    text: day,
                    type: 'current'
                }));
                days = [...prevMonthDays, ...currentMonthDays];
                const nextMonthDays = rangeArr(42 - days.length).map((_, index) => ({
                    text: index + 1,
                    type: 'next'
                }));
                days = days.concat(nextMonthDays);
            }
            return this.toNestedArr(days);
        },

        weekDays() {
            const start = this.firstDayOfWeek;
            const { WEEK_DAYS } = this;

            if (typeof start !== 'number' || start === 0) {
                return WEEK_DAYS.slice();
            } else {
                return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start));
            }
        }
    },

    render() {

        const thead = this.hideHeader ? null : (<thead>
            {
                this.weekDays.map(day => <th key={day}>{this.type === 1 ? '周' : ''}{day}</th>)
            }
        </thead>);
        return (
            <table
                class={{
                    'el-calendar-table': true,
                    'is-range': this.isInRange,
                    'calendar-table-big': this.type === 1,
                    'calendar-table-small': this.type !== 1,
                }}
                cellspacing="0"

                cellpadding="0">
                {
                    thead
                }
                <tbody>
                    {
                        this.rows.map((row, index) => <tr
                            class={{
                                'el-calendar-table__row': true,
                                'el-calendar-table__row--hide-border': index === 0 && this.hideHeader
                            }}
                            key={index}>
                            {
                                row.map((cell, key) => <td key={key}
                                    class={this.getCellClass(cell)}
                                    onClick={this.pickDay.bind(this, cell)}>
                                    <div class="el-calendar-day project-container"
                                        onClick={(e) => this.handleClick(e, cell)}>
                                        {
                                            this.cellRenderProxy(cell, index, key)
                                        }
                                    </div>
                                </td>)
                            }
                        </tr>)
                    }
                </tbody>
            </table>);
    }
};
</script>
<style lang="less" scoped>
@date-height-big: 38px;
@project-height-big: 28px;

@date-height-small: 18px;
@project-height-small: 4px;

.el-calendar-day.project-container {
    background: #ffffff;
    height: auto;
    padding: 0;
    .date-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-right: solid 1px #efefef;
        .project-lists {
            width: 100%;
            display: flex;
            flex-direction: column;
            //
            border-bottom: solid 1px #e0e0e0;
            //
            .project-wrap {
                display: flex;
                border-top: solid 2px #fff;
                border-bottom: solid 2px #fff;
                .project {
                    font-size: 14px;
                    color: #061178;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    flex-grow: 1;
                    margin: 2px 0;
                }
            }
        }
    }
}

// 小日历样式
.calendar-table-small {
    .date-container {
        .date-info {
            font-size: 12px;
            width: @date-height-small;
            height: @date-height-small;
            line-height: @date-height-small;
            border-radius: @date-height-small / 2;
            text-align: center;
        }
        .project-lists {
            .project-first {
                border-top-left-radius: @project-height-small / 2;
                border-bottom-left-radius: @project-height-small / 2;
            }
            .project-last {
                border-top-right-radius: @project-height-small / 2;
                border-bottom-right-radius: @project-height-small / 2;
            }
            .project-wrap {
                height: @project-height-small;
                line-height: @project-height-small;
                .project {
                    height: @project-height-small;
                    line-height: @project-height-small;
                }
            }
        }
    }
}

// 大日历样式
.calendar-table-big {
    .date-container {
        .date-info {
            font-size: 18px;
            width: @date-height-big;
            height: @date-height-big;
            line-height: @date-height-big;
            border-radius: @date-height-big / 2;
            margin: 8px 0;
            text-align: center;
        }
        .project-lists {
            min-height: 40px;
            padding-bottom: 30px;
            .project-first {
                border-top-left-radius: @project-height-big / 2;
                border-bottom-left-radius: @project-height-big / 2;
            }
            .project-last {
                border-top-right-radius: @project-height-big / 2;
                border-bottom-right-radius: @project-height-big / 2;
            }
            .project-wrap {
                .project {
                    height: @project-height-big;
                    line-height: @project-height-big;
                }
            }
            .project-wrap-first {
                border-top-left-radius: 4 + @project-height-big / 2;
                border-bottom-left-radius: 4 + @project-height-big / 2;
                padding-left: 2px;
                border-left: solid 2px #fff;
            }
            .project-wrap-last {
                border-top-right-radius: 4 + @project-height-big / 2;
                border-bottom-right-radius: 4 + @project-height-big / 2;
                padding-right: 2px;
                border-right: solid 2px #fff;
            }
            .project-wrap.project-wrap-hover {
                border-top: solid 2px #ff4d4f;
                border-bottom: solid 2px #ff4d4f;
            }
            .project-wrap-hover.project-wrap-first {
                border-left: solid 2px #ff4d4f;
                border-top: solid 2px #ff4d4f;
                border-bottom: solid 2px #ff4d4f;
            }
            .project-wrap-hover.project-wrap-last {
                border-right: solid 2px #ff4d4f;
                border-top: solid 2px #ff4d4f;
                border-bottom: solid 2px #ff4d4f;
            }
        }
    }
}

.el-calendar-table {
    th {
        border-bottom: solid 1px #e0e0e0;
        height: 30px;
        line-height: 30px;
    }
}

.no-border-please {
    border: 0 !important;
}

.is-today {
    .date-info {
        background: #597ef7;
        color: #fff;
    }
}
</style>