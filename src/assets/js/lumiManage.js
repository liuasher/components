/*
 * @Author: wuhaiwei 
 * @Date: 2018-10-18 15:02:55 
 * @Last Modified by: wuhaiwei
 * @Last Modified time: 2018-10-24 16:26:09
 */
/**
 * 主要用于绿米各种设备转换
 */
export default {
  /**
   * rgb与亮度结合，生成16进制颜色标识
   * @param {*} rgb
   * @param {*} light
   */
  getRgbHexCode(rgb, light) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (rgb == undefined) {
      return;
    }
    let sColor = rgb.toLowerCase();
    let sColorChange = [];
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#';
        for (let i = 1; i < 4; i++) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
      }
    } else {
      sColor = sColor.substr(4, sColor.length - 1);
      sColorChange = sColor.split(',');
    }
    let l = parseInt(light).toString(16);
    let r = parseInt(sColorChange[0]).toString(16);
    let g = parseInt(sColorChange[1]).toString(16);
    let b = parseInt(sColorChange[2]).toString(16);
    let value = l + r + g + b;
    return parseInt(value, 16);
  },
  /**
   * 后台的rgb值，转换rgb对应的亮度、颜色
   * @param {*} unitValue
   */
  getRgbCode(unitValue) {
    let hexValue = parseInt(unitValue).toString(16);
    let len = hexValue.length;
    if (len < 8) {
      for (let i = 0; i < 8 - len; i++) {
        hexValue = '0' + hexValue;
      }
    }
    hexValue = hexValue.replace(/\s/g, '0');
    let l = parseInt(hexValue.substring(0, 2), 16);
    let color = '#' + hexValue.substring(2, 8);

    return {
      color: color,
      light: l
    };
  },
  /**
   * // 将空调开关状态、模式、风速、扫风、温度转换成unitValue
   * @param {*} switchStatus
   * @param {*} mode
   * @param {*} windSpeed
   * @param {*} windSweep
   * @param {*} temperature
   */
  getAcHexCode(switchStatus, mode, windSpeed, windSweep, temperature) {
    let switchStatusHex = parseInt(switchStatus).toString(16);
    let modeHex = parseInt(mode).toString(16);
    let windSpeedHex = parseInt(windSpeed).toString(16);
    let windSweepHex = parseInt(windSweep).toString(16);
    let controlTemp = parseInt(temperature).toString(16);
    let controlTempHex = controlTemp;
    if (controlTemp.length == 1) {
      controlTempHex = '0' + controlTemp;
    }
    let condition =
      switchStatusHex +
      modeHex +
      windSpeedHex +
      windSweepHex +
      controlTempHex +
      '00';
    return parseInt(condition, 16);
  },
  /**
   * 将空调unitValue转换成开关状态、温度、模式、风速、扫风
   * @param {*} unitValue
   */
  getAcCode(unitValue) {
    let hexValue = parseInt(unitValue).toString(16);
    let len = hexValue.length;
    if (len < 8) {
      for (let i = 0; i < 8 - len; i++) {
        hexValue = '0' + hexValue;
      }
    }
    hexValue = hexValue.replace(/\s/g, '0');
    let switchStatus = parseInt(hexValue.substring(0, 1), 16); // 开关状态 0: off; 1: on; 2: toggle; E: circle; F: invalid; else: reserve
    let modeStatus = parseInt(hexValue.substring(1, 2), 16); // 模式（制冷，制热，除湿，自动，送风）0: heat; 1: cool; 2: auto; 3: dry; 4: wind; E: circle; F: invalid; else: reserve
    let windSpeed = parseInt(hexValue.substring(2, 3), 16); // 风速(高中低，自动)0: low; 1: middle; 2: high; 3: auto; E: circle; F: invalid; else: reserve
    let windInt = parseInt(hexValue.substring(3, 4), 16);
    let windDirect = windInt > 7 ? windInt / 4 : 0; // 风向 0: horizontal; 1: vertical; 2: circle; 3: invalid;
    let windSweep = windInt % 4; // 扫风（扫风|不扫风）0: swing; 1: fix; 2: circle; 3: invalid;
    let temperature = parseInt(
      hexValue.substring(4, 5) + hexValue.substring(5, 6),
      16
    ); // 温度
    return {
      switchStatus,
      modeStatus,
      windSpeed,
      windDirect,
      windSweep,
      temperature
    };
  },
  /**
   * 获取空调模式
   * @param {*} status
   */
  getModeStatus(status) {
    // 模式（制冷，制热，除湿，自动，送风）0: heat; 1: cool; 2: auto; 3: dry; 4: wind; E: circle; F: invalid; else: reserve
    let state = '';
    switch (status) {
      case 0:
        state = '制热';
        break;
      case 1:
        state = '制冷';
        break;
      case 2:
        state = '自动';
        break;
      case 3:
        state = '除湿';
        break;
      case 4:
        state = '送风';
        break;
    }
    return state;
  },
  /**
   * 获取空调风速
   * @param {*} status
   */
  getWindSpeed(status) {
    // 风速(高中低，自动)0: low; 1: middle; 2: high; 3: auto; E: circle; F: invalid; else: reserve
    let state = '';
    switch (status) {
      case 0:
        state = '低速';
        break;
      case 1:
        state = '中速';
        break;
      case 2:
        state = '高速';
        break;
      case 3:
        state = '自动';
        break;
    }
    return state;
  }
};
