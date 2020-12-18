
<template>
    <div id="mountNode"></div>
</template>

<script>
import G6 from '@antv/g6';
import { MockData } from './mock.ts';
import { GPosition } from '../components/index.ts';

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
        GPosition(G6);
        console.log(333, GPosition);

        // 注册一个node
        G6.registerNode(
            'aqara-device-nodes',
            {
                afterDraw(cfg, group) {
                    const size = cfg.size;

                    /** 顶部文本 */
                    // group.addShape('tp-position');
                    // group.addGroup('tp-position');

                    /** 底部文本 */
                    group.addShape('text', {
                        attrs: {
                            x: CELL.WIDTH / 2, // 居中
                            y: CELL.HEIGHT - TOP_LABEL.HEIGHT,
                            width: BOTTOM_LABEL.WIDTH,
                            height: BOTTOM_LABEL.HEIGHT,
                            textAlign: 'center',
                            // textBaseline: 'middle',
                            text: cfg.label,
                            fill: '#666',
                        },
                        name: 'text-shape',
                        draggable: true,
                    });

                    // 添加图片
                    // group.addShape('image', {
                    //     attrs: {
                    //         x: (CELL.WIDTH - ICON.WIDTH) / 2,
                    //         y: CELL.HEIGHT - ICON.HEIGHT - BOTTOM_LABEL.HEIGHT,
                    //         width: ICON.WIDTH,
                    //         height: ICON.HEIGHT,
                    //         img:
                    //             'https://cnbj2.fds.api.xiaomi.com/lumiaiot/device/model/lumi.acpartner.v3.png',
                    //     },
                    //     // must be assigned in G6 3.3 and later versions. it can be any value you want
                    //     name: 'image-shape',
                    // });
                },
                draw(cfg, group) {
                    const size = this.getSize(cfg); // 转换成 [width, height] 的模式
                    const color = cfg.color;
                    const width = size[0];
                    const height = size[1];

                    const path = [
                        ['M', 0, 0], // 起始
                        ['L', width, 0],
                        ['L', width, height],
                        ['L', 0, height],
                        ['Z'], // 封闭
                    ];
                    const style = G6.Util.mix(
                        {},
                        {
                            path: path,
                            stroke: color,
                        },
                        cfg.style
                    );
                    // 增加一个 path 图形作为 keyShape
                    const keyShape = group.addShape('path', {
                        attrs: {
                            ...style,
                        },
                        draggable: true,
                        name: 'diamond-keyShape',
                    });
                    // 返回 keyShape
                    return keyShape;
                },
            },
            // 注意这里继承了 'single-node'
            'single-node'
        );

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