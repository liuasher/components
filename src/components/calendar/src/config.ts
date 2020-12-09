
/**
 * 大日历最多展示20条数据，氛围4组，每组5个，颜色深度逐级递减
 */
const Blue = ['#4e6def', '#7b91f2', '#9faff2', '#bac5f2', '#d4dcf4',]
const Green = ['#29aeae', '#5fc0c2', '#8dd1d3', '#aedbdd', '#cee7e9']
const Yellow = ['#f8b42a', '#f6c363', '#f5d390', '#f2dcb1', '#f0e7d2']
const Purple = ['#8c72eb', '#a793ed', '#beb2f0', '#cec6f1', '#dfddf3']


export default {
    PresetColor: Blue.concat(Green, Yellow, Purple)
}