<script>
import fecha from 'element-ui/src/utils/date';
import { range as rangeArr, getFirstDayOfMonth, getPrevMonthLastDays, getMonthDays, getI18nSettings, validateRangeInOneMonth } from 'element-ui/src/utils/date-util';
import dayjs from 'dayjs';
const oneDay = 86400000;
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
        selectedId: String
    },

    inject: ['elCalendar'],

    data() {
        return {
            WEEK_DAYS: getI18nSettings().dayNames,
            PresetColor: ['#ee68b0', '#5ebbd7', '#afd276', '#ff9110', '#7687d2']
        };
    },

    methods: {
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
            const classes = [type];
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


        isStart(project, date) {
            return project.startTime + oneDay > date;
        },
        isEnd(project, date) {
            return project.endTime - oneDay < date;
        },
        hasContent(project, date, classes, { rowIndex, itemIndex }) {
            if (classes.indexOf('track-first') !== -1) {
                return true;
            } else if (rowIndex === 0 && itemIndex === 0 && !this.hideHeader) {
                return true;
            }
            return false;
        },
        getTips(project) {
            return `
                项目: ${project.projectName}
                开始: ${project.startTime}
                结束: ${project.endTime}
            `;
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
            const classes = ['project'];
            if (project.startTime <= date && date <= project.endTime) {
                if (this.isStart(project, date)) {
                    classes.push('track-first');
                }
                if (this.isEnd(project, date)) {
                    classes.push('track-last');
                }
                const hasContent = this.hasContent(project, date, classes, indexGroup);
                const content = `${project.projectName}（共${project.authDays}天权限）`
                //
                if (projectIndex == this.selectedId) {
                    classes.push('track-opacity')
                }
                return <el-tooltip open-delay={600} class="item" effect="dark" placement="top">
                    <div slot="content">{this.getTips(project)}</div>
                    <span data-project-index={projectIndex} class={classes} style={{ backgroundColor: this.PresetColor[projectIndex] }}>
                        {hasContent ? content : ''}
                    </span>;
                </el-tooltip>;
            }
            return <span class="project"></span>;
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
                <div class="date-info">{text}</div>
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
                this.weekDays.map(day => <th key={day}>{day}</th>)
            }
        </thead>);
        return (
            <table
                class={{
                    'el-calendar-table': true,
                    'is-range': this.isInRange
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
@dateHeight: 26px;
@projectHeight: 14px;

.el-calendar-day.project-container {
    background: #ffffff;
    height: auto;
    padding: 0;
    .date-container {
        .date-info {
            width: @dateHeight;
            font-size: 12px;
            height: @dateHeight;
            line-height: @dateHeight;
            border-radius: @dateHeight / 2;
            margin: 0 auto;
            margin-top: 2px;
            margin-bottom: 2px;
            text-align: center;
        }
        .project-lists {
            display: flex;
            flex-direction: column;
            .project {
                font-size: 12px;
                height: @projectHeight;
                line-height: @projectHeight;
                margin-top: 2px;
                color: #333;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            // .project:hover {
            //     opacity: 0.8;
            // }
            .track-first {
                border-top-left-radius: 6px;
                border-bottom-left-radius: 6px;
                text-indent: 6px;
            }
            .track-last {
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
                text-indent: 6px;
            }
            .track-opacity {
                background: #409eff !important;
            }
        }
    }
}
.is-today {
    .date-info {
        background: #ee3030;
        color: #fff;
    }
}
</style>