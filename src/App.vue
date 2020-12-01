
<template>
    <div class="select-search">
        <el-calendar v-model="value"
                     :projects="projectLists">
        </el-calendar>
    </div>
</template>
<script>

export default {
    name: 'App',
    components: {

    },
    data() {
        return {
            value: new Date(),
            projectLists: [{
                startTime: 1605783746430,
                endTime: 1607079746430,
                projectName: 'Project 001',
                projectId: 'pj.000001'
            }, {
                startTime: 1601439745090,
                endTime: 1609215745090,
                projectName: 'Project 002',
                projectId: 'pj.000002'
            }, {
                startTime: 1602486035455,
                endTime: 1610262035455,
                projectName: 'Project 003',
                projectId: 'pj.000003'
            }, {
                startTime: 1605783748660,
                endTime: 1607079748660,
                projectName: 'Project 004',
                projectId: 'pj.000004'
            }]
        };
    },
    watch: {

    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    methods: {


    }
};
</script>

<style lang="less">
</style>
