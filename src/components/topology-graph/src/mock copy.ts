var MockData = {
    nodes: [{
        id: "lumi.001",
        label: "P3"
    }, {
        id: "lumi.002",
        label: "M2",

    }, {
        id: "lumi.003",
        label: "M1S"
    }, {
        id: "lumi.004",
        label: "灯带004"
    }, {
        id: "lumi.005",
        label: "灯带005"
    }, {
        id: "lumi.006",
        label: "灯带006"
    }, {
        id: "lumi.007",
        label: "灯带007"
    }, {
        id: "lumi.008",
        label: "灯带008"
    }, {
        id: "lumi.009",
        label: "窗帘电机009"
    }, {
        id: "lumi.010",
        label: "窗帘电机010"
    }, {
        id: "lumi.011",
        label: "窗帘电机011"
    }, {
        id: "lumi.012",
        label: "窗帘电机012"
    }, {
        id: "lumi.013",
        label: "墙壁插座H1-13"
    }, {
        id: "lumi.014",
        label: "墙壁插座H1-14"
    }],
    edges: [{
        source: "lumi.004",
        target: "lumi.001",
        type: 'quadratic',
    }, {
        source: "lumi.005",
        target: "lumi.001",
        type: 'quadratic',
    }, {
        source: "lumi.006",
        target: "lumi.001",
        type: 'quadratic',
    }, {
        source: "lumi.007",
        target: "lumi.001",
        type: 'quadratic',
    }, {
        source: "lumi.008",
        target: "lumi.001",
        type: 'quadratic',
    }, {
        source: "lumi.009",
        target: "lumi.002",
        type: 'quadratic',
    }, {
        source: "lumi.010",
        target: "lumi.002",
        type: 'quadratic',
    }, {
        source: "lumi.011",
        target: "lumi.002",
        type: 'quadratic',
    }, {
        source: "lumi.012",
        target: "lumi.002",
        type: 'quadratic',
    }, {
        source: "lumi.013",
        target: "lumi.003",
        type: 'quadratic',
    }, {
        source: "lumi.014",
        target: "lumi.003",
        type: 'quadratic',
    }, {
        source: "lumi.003",
        target: "lumi.002",
        type: 'quadratic',
    },

    {
        target: "lumi.004",
        source: "lumi.001",
        type: 'quadratic',
    }, {
        target: "lumi.005",
        source: "lumi.001",
        type: 'quadratic',
    }, {
        target: "lumi.006",
        source: "lumi.001",
        type: 'quadratic',
    }, {
        target: "lumi.007",
        source: "lumi.001",
        type: 'quadratic',
    }, {
        target: "lumi.008",
        source: "lumi.001",
        type: 'quadratic',
    }, {
        target: "lumi.009",
        source: "lumi.002",
        type: 'quadratic',
    }, {
        target: "lumi.010",
        source: "lumi.002",
        type: 'quadratic',
    }, {
        target: "lumi.011",
        source: "lumi.002",
        type: 'quadratic',
    }, {
        target: "lumi.012",
        source: "lumi.002",
        type: 'quadratic',
    }, {
        target: "lumi.013",
        source: "lumi.003",
        type: 'quadratic',
    }, {
        target: "lumi.014",
        source: "lumi.003",
        type: 'quadratic',
    }, {
        target: "lumi.003",
        source: "lumi.002",
        type: 'quadratic',
    },



    {
        source: "lumi.002",
        target: "lumi.001",
        type: 'quadratic',
    }, {
        source: "lumi.001",
        target: "lumi.002",
        type: 'quadratic',
    }]
};

export {
    MockData
}