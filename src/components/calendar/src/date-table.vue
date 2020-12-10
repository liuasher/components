<script>
import fecha from 'element-ui/src/utils/date';
import { range as rangeArr, getFirstDayOfMonth, getPrevMonthLastDays, getMonthDays, getI18nSettings, validateRangeInOneMonth } from 'element-ui/src/utils/date-util';
import dayjs from 'dayjs';
import Config from './config.ts'
const oneDay = 86400000;
const oneWeek = oneDay * 7;
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
            Matrix: this.getMatrix(),
            Debug: false
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
                /** 计算开始百分比 00:00:00 ~ [proStart ~ 23:59:59] */
                const proStart = project.startTime
                const todayEnd = dayjs(proStart).hour(23).minute(59).second(59).millisecond(59).valueOf()
                // 样式要用marginLeft，所以要计算当天到开始的空白
                const value = (oneDay - todayEnd + proStart) / oneDay;
                const target = Math.round(value * 100)
                return `${Math.min(target, 60)}%`
            } else {
                /** 计算结束百分比 [00:00:00 ~ proEnd] ~ 23:59:59 */
                const proEnd = project.endTime
                const todayStart = dayjs(proEnd).hour(0).minute(0).second(0).millisecond(0).valueOf()
                // 样式使用width，所以使用是当天到结束
                const value = (proEnd - todayStart) / oneDay;
                const target = Math.round(value * 100);
                return `${Math.max(target, 40)}%`
            }
        },

        /** 项目的开始 */
        startHitLane(project, date) {
            const { dayStart, dayEnd } = this.dayRange(date)
            const { startTime, endTime } = project
            return dayStart <= startTime && startTime <= dayEnd
        },
        /** 项目的过程 */
        durationHitLane(project, date) {
            const { dayStart, dayEnd } = this.dayRange(date)
            const { startTime, endTime } = project
            return startTime < dayStart && dayEnd < endTime
        },
        /** 项目的结束 */
        endHitLane(project, date) {
            const { dayStart, dayEnd } = this.dayRange(date)
            const { startTime, endTime } = project
            return startTime < dayStart && (dayStart < endTime && endTime < dayEnd)
        },

        /**
         * 元素内渲染每个project的方法（每个cell遍历渲染project）
         * @param {project} project  项目
         * @param {timestamp} date  元素代表的日期
         * @param {number} rowIndex  每一行的索引
         * @param {number} itemIndex 一行内元素的索引
         * @param {number} projectIndex 元素内项目的索引
         */
        renderProject(project, date, indexGroup) {
            const { projectIndex, rowIndex, itemIndex } = indexGroup;
            // 先取出项目对应的颜色
            const BackgroundStyle = [{ backgroundColor: this.PresetColor[projectIndex] }]
            const MarginStyle = []
            // 用来区别头、身、尾 
            const HoverClass = [];
            const BorderClass = []
            const WrapBorderClass = []
            const content = []

            // 选中的统一加上border
            if (projectIndex == this.selectedId) {
                HoverClass.push('project-wrap-hover')
            }

            // 每行泳道的第一个元素
            if (indexGroup.itemIndex === 0) {
                this.isLaneOverlap(project, date, indexGroup)
            }

            // 获取当天的日期范围
            const { dayStart, dayEnd } = this.dayRange(date)

            if (this.startHitLane(project, date)) {
                /** 开始命中 */
                BorderClass.push('project-first');
                WrapBorderClass.push('project-wrap-first');
                MarginStyle.push({ marginLeft: this.getPercent(project, true) })

            } else if (this.endHitLane(project, date)) {
                /** 结束命中 */
                BorderClass.push('project-last');
                WrapBorderClass.push('project-wrap-last');
                MarginStyle.push({ width: this.getPercent(project, false) })

            } else if (this.durationHitLane(project, date)) {
                /** 过程命中 */

            } else {
                /** 未命中，未命中的有自己的显隐逻辑 */
                return this.noHitLane(project, date, indexGroup)
            }

            /** 一个泳道上如何显示content有自己的计算规则（不能笼统的放在startHit） */
            const hasContent = this.hasContent(project, date, BorderClass, indexGroup);
            hasContent && content.push(`（${indexGroup.projectIndex + 1}）查看`)
            // hasContent && content.push(`${project.projectName}`)

            // 命中的统一处理
            return <el-tooltip open-delay={600} class="item" effect="dark" placement="top">
                <div slot="content">{this.getTips(project)}</div>
                <span data-project-index={projectIndex} class={['project-wrap', WrapBorderClass, HoverClass]} style={MarginStyle}>
                    <span data-project-index={projectIndex} class={['project', BorderClass]} style={BackgroundStyle}>
                        {
                            this.Debug ? `${projectIndex}-${rowIndex}-${itemIndex}` : content
                        }
                    </span>
                </span>
            </el-tooltip>;
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

        /**
         * 返回一天的00:00:00 - 23:59:59
         */
        dayRange(date) {
            const dayStart = dayjs(date);
            const dayEnd = dayjs(date).hour(23).minute(59).second(59).millisecond(59)
            return { dayStart, dayEnd }
        },

        /**
         * 项目没有命中本周
         */
        notHitWeek({ startTime, endTime }, date) {
            const { rowStart, rowEnd } = this.getWeekRange(date)
            return rowEnd < startTime || endTime < rowStart
        },
        /**
         * 项目开始命中本周 
         */
        startHitWeek({ startTime, endTime }, date) {
            const { rowStart, rowEnd } = this.getWeekRange(date)
            return rowStart <= startTime && startTime <= rowEnd
        },
        /**
         * 项目结束命中本周 
         */
        endHitWeek({ startTime, endTime }, date) {
            const { rowStart, rowEnd } = this.getWeekRange(date)
            return rowStart <= endTime && endTime <= rowEnd
        },
        /**
         * 判断最近两个项目泳道是否重叠
         * @param {1 | 2} lapType  命中方式 1:头命中 2:尾命中
         */
        isLaneOverlap(project, date, { rowIndex, itemIndex, projectIndex }) {
            const nextPro = this.projects[projectIndex + 1]
            // 如果已经没有了
            if (nextPro === undefined || project === undefined) return;

            // 先判断本周的命中类型
            const startHitWeek = this.startHitWeek(project, date)
            const endHitWeek = this.endHitWeek(project, date)

            const { startTime: pS, endTime: pE } = project
            const { startTime: nS, endTime: nE } = nextPro

            if (startHitWeek && endHitWeek === true) {
                // console.log(`首尾都命中: ${projectIndex}-${rowIndex}-${itemIndex}`, project.projectName)
                this.compareBoth(project, nextPro, { rowIndex, itemIndex, projectIndex })
            } else if (startHitWeek === true) {
                // console.log(`首命中: ${projectIndex}-${rowIndex}-${itemIndex}`, project.projectName)
                this.compareStart(project, nextPro, { rowIndex, itemIndex, projectIndex })
            } else if (endHitWeek === true) {
                // console.log(`尾命中: ${projectIndex}-${rowIndex}-${itemIndex}`, project.projectName)
                this.compareEnd(project, nextPro, { rowIndex, itemIndex, projectIndex })
            } else {
                // 未命中的会由别的逻辑过滤掉
            }

        },


        /**
         * 处理矩阵
         * 元素内渲染每个project的方法（每个cell遍历渲染project）
         * @param {number} rowIndex  每一行的索引（周索引）
         * @param {number} projectIndex 元素内项目的索引
         */
        matrixMerget(pRange, nRange, projectIndex, rowIndex) {

            const notHitAbove = false;

            // const prev = this.Matrix[projectIndex - 1][rowIndex]
            // const current = this.Matrix[projectIndex][rowIndex]
            // const nect = this.Matrix[projectIndex + 1][rowIndex]


            // const target = this.Matrix[projectIndex][rowIndex]
            // if (target instanceof Array) {
            //     this.Matrix[projectIndex][rowIndex] = target.concat(pRange)
            // } else {
            //     this.Matrix[projectIndex][rowIndex] = pRange
            // }
            // if (this.Matrix[projectIndex + 1] !== undefined) {
            //     this.Matrix[projectIndex + 1][rowIndex] = nRange
            // }
        },

        // 首尾都命中
        compareBoth(
            { startTime: pS, endTime: pE, projectName: pN },
            { startTime: nS, endTime: nE, projectName: nN },
            { rowIndex, itemIndex, projectIndex }
        ) {
            const nextEndHix = this.endHitWeek({ startTime: nS, endTime: nE }, pS)
            const nextStartHix = this.startHitWeek({ startTime: nS, endTime: nE }, pS)

            if ((nE < pS) && nextEndHix) {
                // 上个没开始，下个结束了
                const pRange = this.getRange(pS, false)
                const nRange = this.getRange(nE, true)
                this.matrixMerget(pRange, nRange, projectIndex, rowIndex)
                // console.log('上后下先，上面需要标注范围：', pN, pRange)
            } else if ((pE < nS) && nextStartHix) {
                // 下个没开始，上个结束了
                const pRange = this.getRange(pE, true)
                const nRange = this.getRange(nS, false)
                this.matrixMerget(pRange, nRange, projectIndex, rowIndex)
                // console.log('上先下后，上面需要标注范围：', pN, pRange)
            }
        },

        // 开头命中
        compareStart({ pS, pE }, { nS, nE }) {

        },
        // 结尾命中
        compareEnd({ pS, pE }, { nS, nE }) {

        },
        // 传入一个日期，它占据周几的索引
        // 比如传入周三 true, 返回[0,1,2]
        // 传入周四 false，返回[3,4,5,6]
        // 1~6 周一~周六 0 周日
        getRange(date, inOrder) {
            const target = dayjs(date).day()
            console.log('--------->: ', target, inOrder)
            switch (target) {
                case 0:
                    return inOrder ? [] : [0, 1, 2, 3, 4, 5]
                case 1:
                    return inOrder ? [1, 2, 3, 4, 5, 6] : []
                case 2:
                    return inOrder ? [2, 3, 4, 5, 6] : [0]
                case 3:
                    return inOrder ? [3, 4, 5, 6] : [0, 1]
                case 4:
                    return inOrder ? [4, 5, 6] : [0, 1, 2]
                case 5:
                    return inOrder ? [5, 6] : [0, 1, 2, 3]
                case 6:
                    return inOrder ? [6] : [0, 1, 2, 3, 4]
            }
        },
        /**
         * 判断某一行的项目列表是否显示，如果某一行没有项目命中，该行就不显示
         * @param {number} rowIndex  每一行的索引（周索引）
         * @param {number} itemIndex 一行内元素的索引
         * @param {number} projectIndex 元素内项目的索引
         */
        noHitLane(project, date, { projectIndex, rowIndex, itemIndex }) {

            /** 默认空白占位符 */
            const defaultDom = <span class="project-wrap">
                <span class="project"></span>
            </span>

            // 小日历不作判断，小日历是两个日历拼接，懒得维护变量~
            if (this.type === 2) return defaultDom;

            /** 每个泳道的第一列（每周的第一天） */
            if (itemIndex === 0) {

                if (this.notHitWeek(project, date)) {
                    // 如果这一整行都没命中，标记为true (不显示)
                    this.Matrix[projectIndex][rowIndex] = [0, 1, 2, 3, 4, 5, 6]
                    return <span class={"project-wrap-?"} >
                        <span class="project"></span>
                    </span>;
                }
            } else {
                // 如果不是第一个item 
                const Matrix = this.Matrix[projectIndex][rowIndex]
                /**
                 * Matrix 矩阵里面会有两种类型的值
                 * @param {booean} Matrix true表示一整行都要隐藏
                 * @param {array[number]} Matrix 0-6 表示周一到周日，数组中有值表示该天要隐藏
                 */
                if (Matrix !== false && Matrix.indexOf(itemIndex) !== -1) {
                    return <span class="project-wrap-?" >
                        <span class="project"></span>
                    </span>;
                }
            }

            if ([
                // '123', '124', '125', '126',
                // '220', '221', '222',
                // '225', '226',
                // '320', '321', '322', '323', '324',
                // '425', '426'
            ].indexOf(`${projectIndex}${rowIndex}${itemIndex}`) !== -1) {
                return <span class="project-wrap->" >
                    <span class="project"></span>
                </span>;
            }

            return <span class="project-wrap" >
                <span class="project">
                    {
                        this.Debug ? `${projectIndex} ${rowIndex} ${itemIndex}` : ''
                    }
                </span>
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