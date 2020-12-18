import TopologyGraph from "./src/main.vue";

/* istanbul ignore next */
TopologyGraph.install = function (Vue) {
    Vue.component(TopologyGraph.name, TopologyGraph);
};

export default TopologyGraph;
