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

export default (G6) => {
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
}