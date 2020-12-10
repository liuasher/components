
<template>
    <div class="select-search">

        <el-calendar class="user-style user-style-small"
                     :type="2"
                     :lists="projectLists"
                     @click-item="handleClickProject"
                     @click-detail="handleClickDetail"
                     @switch="handleSwitchMouth" />

        <el-drawer class="calendar-drawer"
                   :visible.sync="drawer"
                   size="70%"
                   direction="rtl">
            <el-calendar class="user-style user-style-big"
                         :type="1"
                         :lists="projectLists"
                         @click-item="handleClickProject"
                         @switch="handleSwitchMouth" />
        </el-drawer>
    </div>
</template>
<script>

import dayjs from 'dayjs';
const oneDay = 86400000;

export default {
    name: 'App',
    mounted() {

    },
    methods: {

        // 点击了项目
        handleClickProject(projects, data) {
            // console.log(projects, data);
        },

        // 月份切换
        handleSwitchMouth({ start, end }) {
            // console.log(6666, start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss'))
        },

        //
        handleClickDetail() {
            this.drawer = true
        }
    },
    data() {
        return {
            drawer: false,
            projectLists: [{
                startTime: dayjs('2020-12-04 12:34:21').valueOf(),
                endTime: dayjs('2020-12-06 12:34:21').valueOf(),
                authDays: 10,
                projectName: '九楼项 001',
                projectId: 'pj.000001'
            }, {
                startTime: dayjs('2020-12-14 06:45:23').valueOf(),
                endTime: dayjs('2020-12-16 06:45:23`').valueOf(),
                authDays: 1,
                projectName: '家庭项 002',
                projectId: 'pj.000002'
            }, {
                startTime: dayjs('2020-12-17 06:45:23').valueOf(),
                endTime: dayjs('2020-12-18 06:45:23`').valueOf(),
                authDays: 1,
                projectName: '家庭项 006',
                projectId: 'pj.000006'
            }, {
                startTime: dayjs('2020-12-19 06:45:23').valueOf(),
                endTime: dayjs('2020-12-20 06:45:23`').valueOf(),
                authDays: 1,
                projectName: '家庭项 007',
                projectId: 'pj.000007'
            }, {
                startTime: dayjs('2020-12-17 06:45:23').valueOf(),
                endTime: dayjs('2020-12-18 06:45:23`').valueOf(),
                authDays: 1,
                projectName: '家庭项 008',
                projectId: 'pj.000008'
            }, {
                startTime: dayjs('2020-12-01 23:30:34').valueOf(),
                endTime: dayjs('2020-12-03 23:30:34').valueOf(),
                authDays: 10,
                projectName: '崇文办 003',
                projectId: 'pj.000003'
            }, {
                startTime: dayjs('2020-11-15 14:45:00').valueOf(),
                endTime: dayjs('2020-12-18 14:45:00').valueOf(),
                authDays: 33,
                projectName: '塘朗城 004',
                projectId: 'pj.000004'
            }, {
                startTime: dayjs('2020-12-06 20:15:30').valueOf(),
                endTime: dayjs('2021-01-08 20:15:30').valueOf(),
                authDays: 32,
                projectName: '智谷项 005',
                projectId: 'pj.000005'
            }]
        };
    },


    computed: {

    },
    created() {

    },


};
</script>

<style lang="less">
.user-style-small {
    width: 300px;
}
.calendar-drawer .rtl {
    overflow-y: auto;
}
</style>
