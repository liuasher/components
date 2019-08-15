<template>
   <ul>
       <li 
        v-for="item in data"
        :key="item.id">
           <slot 
            name="xxxyyy" 
            testProps="子组件的值"></slot>
       </li>
   </ul>
</template>
<script>
export default {
    name: 'Cascader',
    props:{
        data:{
            type: Array,
            default(){
                return [];
            }
        },
    },
    data () {
        return {
            
        };
    },
    computed: {

    },
    methods: {
        
    },
    created () {
        
    },
    mounted () {
        
    },
    watch: {
        
    }
};
</script>
<style lang="less">
</style>

