
<template>
    <div class="select-search">
        <el-select v-model="value"
                   placeholder="请选择">
            <el-option label="大日历"
                       :value="1" />
            <el-option label="小日历"
                       :value="2" />
        </el-select>
        <el-calendar :class="value === 1 ? 'user-style-big': 'user-style-small'"
                     :type="value"
                     :lists="projectLists"
                     @click-item="handleClickProject">

        </el-calendar>
    </div>
</template>
<script>

import dayjs from 'dayjs';

export default {
    name: 'App',
    components: {

    },
    data() {
        return {
            value: 2,
            projectLists: [{
                startTime: dayjs('2020-12-05').valueOf(),
                endTime: dayjs('2020-12-15').valueOf(),
                authDays: 10,
                projectName: '九楼项目 001',
                projectId: 'pj.000001'
            }, {
                startTime: dayjs('2020-12-17').valueOf(),
                endTime: dayjs('2020-12-17`').valueOf(),
                authDays: 1,
                projectName: '家庭项目 002家庭项目 002家庭项目 002家庭项目 002家庭项目 002家庭项目 002',
                projectId: 'pj.000002'
            }, {
                startTime: dayjs('2020-11-10').valueOf(),
                endTime: dayjs('2020-12-30').valueOf(),
                authDays: 10,
                projectName: '崇文办公楼 003',
                projectId: 'pj.000003'
            }, {
                startTime: dayjs('2020-11-15').valueOf(),
                endTime: dayjs('2020-12-18').valueOf(),
                authDays: 33,
                projectName: '塘朗城 004',
                projectId: 'pj.000004'
            }, {
                startTime: dayjs('2020-12-6').valueOf(),
                endTime: dayjs('2021-01-08').valueOf(),
                authDays: 32,
                projectName: '智谷项目 005',
                projectId: 'pj.000005'
            }]
        };
    },
    methods: {
        handleClickProject(projects, data) {
            console.log(projects, data);
        }

    },

    computed: {

    },
    created() {

    },
    mounted() {

    },

};
</script>

<style lang="less">
.user-style-small {
    width: 300px;
    background: lightgoldenrodyellow;
}
.user-style-big {
    width: 900px;
    background: lightgoldenrodyellow;
}
</style>
