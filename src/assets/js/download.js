function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * 以文件流形式下载文件(get)
 * @param {object} config 下载文件参数对象，属性包括：
 * 下载url、参数data、文件名fileName、文件类型fileType、请求头header
 * @param {function} cb1 成功回调
 * @param {function} cb2 失败回调
 * @param {function} cb3 下载进度回调
 */
export function downloadFile(config = {}, cb1, cb2, cb3) {
  let url = config.url || '';
  const data = config.data || {};
  const header = config.header && Object.prototype.toString.call(config.header) === '[object Object]' ? config.header : {};
  const fileType = config.fileType || '';
  const fileName = config.fileName || '';
  const loging = config.loging && typeof config.loging === 'boolean' ? config.loging : false;

  // check parameter 
  if (!Trim(url).length) {
    console.error('Missing url param or illegal param, please check it.');
    return;
  }
  if (!Trim(fileName).length) {
    console.error('Missing fileName param or illegal param, please check it.');
    return;
  }
  if (!Trim(fileType).length) {
    console.error('Missing fileType param or illegal param, please check it.');
    return;
  }

  const xhr = new XMLHttpRequest();

  // splice url parameters
  let paramStr = '';
  Object.keys(data).forEach(key => {
    if (data[key] || data[key] === 0 || data[key] === '') {
      paramStr += key + '=' + data[key] + '&';
    }
  });
  if (paramStr !== '') {
    paramStr = paramStr.substr(0, paramStr.lastIndexOf('&'));
    url = url + '?' + paramStr;
  }

  // set responseType data type
  xhr.responseType = 'blob';

  xhr.open('get', url, true);

  // if has any request header, set the request header
  if (Object.keys(header).length) {
    for (let key in header) {
      xhr.setRequestHeader(key, header[key]);
    }
  }

  xhr.onloadstart = function () {
    if (loging) {
      console.log('Is on onloadstart!');
    }
    cb3 && cb3({ percent: 0, status: 'prepare' });
  };

  xhr.onprogress = function (e) {
    if (Object.prototype.toString.call(cb3) !== '[object Function]') {
      return;
    }

    let content_length = xhr.getResponseHeader('File-Length');
    let percent;
    if (loging) {
      console.log('Is on onprogress!');
    }

    // Sometimes, xhr lengthcomputable return false
    // In this case, you need to set a Content-Length http response header
    // But, sometimes nginx may remove the Content-Length header
    // So, you need to use other header instead of Content-Length

    // more information:
    // stackoverflow.com/questions/16034312/ajax-xhr-lengthcomputable-return-false-with-php-file
    // stackoverflow.com/questions/15097712/how-can-i-use-deflated-gzipped-content-with-an-xhr-onprogress-function/32799706#32799706
    // stackoverflow.com/questions/5822985/cross-domain-resource-sharing-get-refused-to-get-unsafe-header-etag-from-re

    if (e.lengthComputable) {
      if (loging) {
        console.log('LengthComputable is available');
        console.log('percent:', (e.loaded / e.total * 100).toFixed(2));
      }
      percent = (e.loaded / e.total * 100).toFixed(2);
    } else if (content_length !== null) {
      if (loging) {
        console.log('LengthComputable is not available');
        console.log('percent:', (e.loaded / content_length * 100).toFixed(2));
      }
      percent = (e.loaded / content_length * 100).toFixed(2);
    }
    cb3 && cb3({ percent, status: 'success' });
  };

  xhr.onload = function () {
    if (this.status === 200) {
      const blob = new Blob([this.response]);
      const a = document.createElement('a');
      a.download = fileName + fileType;
      a.href = URL.createObjectURL(blob);
      // 兼容Firefox
      document.body.appendChild(a);
      a.click();
      a.remove();
      cb1 && cb1({ code: 0, msg: '下载成功' });
      cb3 && cb3({ percent: 100, status: 'success' });
    } else {
      cb2 && cb2({ code: -1, msg: '下载失败' });
      cb3 && cb3({ percent: 0, status: 'error' });
    }
  };

  xhr.onerror = function () {
    cb2 && cb2({ code: -1, msg: '下载失败' });
    cb3 && cb3({ percent: 0, status: 'error' });
  };

  xhr.send(null);
}