
<template>
    <div id="mountNode"></div>
</template>

<script>
import G6 from '@antv/g6';
import { MockData } from './mock.ts';
import TopologyCell from '../components/index.ts';

const NodeSize = 80;
// 单元格
const CELL = {
    WIDTH: 90,
    HEIGHT: 120,
};
// 图标
const ICON = {
    WIDTH: 60,
    HEIGHT: 60,
};
// 顶部信息
const TOP_LABEL = {
    WIDTH: CELL.WIDTH,
    HEIGHT: 20,
};
// 底部信息
const BOTTOM_LABEL = {
    WIDTH: CELL.WIDTH,
    HEIGHT: 20,
};
const LABEL_HEIGHT = 20;
export default {
    name: 'TopologyGraph',

    data() {
        return {};
    },

    components: {},

    props: {},

    mounted() {
        // install
        TopologyCell.register(G6);

        console.log(333, TopologyCell);

        var graph = new G6.Graph({
            container: 'mountNode',
            width: window.innerWidth,
            height: window.innerHeight,
            modes: {
                default: [
                    'drag-canvas',
                    'drag-node',
                    {
                        type: 'tooltip',
                        formatText: function formatText(model) {
                            return model.name;
                        },
                    },
                    {
                        type: 'edge-tooltip',
                        formatText: function formatText(model, e) {
                            var edge = e.item;
                            return (
                                '来源：' +
                                edge.getSource().getModel().name +
                                '<br/>去向：' +
                                edge.getTarget().getModel().name
                            );
                        },
                    },
                ],
            },
            layout: {
                /** radial */
                // type: 'radial',
                // strictRadial: true,
                // preventOverlap: true,
                // unitRadius: 250, // 每一圈距离上一圈的距离
                // linkDistance: NodeSize * 2, // 边长
                // nodeSize: NodeSize,
                /**  */
                type: 'dagre',
                rankdir: 'TB',
                align: 'DR',
                nodesep: 30, // 节点间距离
                ranksep: 30, // 层级间距离
            },
            animate: true,
            defaultNode: {
                type: 'aqara-device-nodes',
                // size: NodeSize,
                size: [CELL.WIDTH, CELL.HEIGHT],
                color: 'steelblue',
                style: {
                    lineWidth: 2,
                    fill: '#fff',
                },
                anchorPoints: [
                    [0.5, 1],
                    [0.5, 0],
                ],
            },
            defaultEdge: {
                shape: 'arc',
                label: '90',
                style: {
                    endArrow: true,
                    lineWidth: 2,
                    stroke: '#87e8de',
                },
                labelCfg: {
                    // autoRotate: true,
                    // refY: 10,
                },
                // curveOffset: -30,
            },
        });
        graph.data(MockData);
        graph.render();

        setTimeout(() => {
            graph.updateLayout({
                // rankdir: 'LR',
                // align: 'DL',
            });
        }, 200);

        // graph.on('node:mouseenter', function (e) {
        //     var item = e.item;
        //     graph.setAutoPaint(false);
        //     graph.getNodes().forEach(function (node) {
        //         graph.clearItemStates(node);
        //         graph.setItemState(node, 'dark', true);
        //     });
        //     graph.setItemState(item, 'dark', false);
        //     graph.setItemState(item, 'highlight', true);
        //     graph.getEdges().forEach(function (edge) {
        //         if (edge.getSource() === item) {
        //             graph.setItemState(edge.getTarget(), 'dark', false);
        //             graph.setItemState(edge.getTarget(), 'highlight', true);
        //             graph.setItemState(edge, 'highlight', true);
        //             edge.toFront();
        //         } else if (edge.getTarget() === item) {
        //             graph.setItemState(edge.getSource(), 'dark', false);
        //             graph.setItemState(edge.getSource(), 'highlight', true);
        //             graph.setItemState(edge, 'highlight', true);
        //             edge.toFront();
        //         } else {
        //             graph.setItemState(edge, 'highlight', false);
        //         }
        //     });
        //     graph.paint();
        //     graph.setAutoPaint(true);
        // });
        // graph.on('node:mouseleave', clearAllStats);
        // graph.on('canvas:click', clearAllStats);
    },

    methods: {},

    computed: {},
};
</script>
<style lang="less" >
.g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}
</style>