const files = require.context('./', true, /\.js$/)
const urlMap = {}

files.keys().forEach(key => {
  if (key === './index.js') {
    return;
  }
  Object.assign(urlMap, files(key).default)
})

export default urlMap
