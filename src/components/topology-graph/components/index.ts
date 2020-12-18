import {
    NodeSize,
    CELL,
    ICON,
    TOP_LABEL,
    BOTTOM_LABEL,
    LABEL_HEIGHT
} from './config.ts'

export default {
    register: (G6) => {
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
}