var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: 'https://acs.ahkui.com/v1/',
  API_KEY: '29d5faa6ed97381a97185f633e19fb47156eb1d0199b9d14e3135cfc0b4a86ffc9cc9d04de6e4dbf12a7790a8bd0d9348efc107f72f78e0f5c4b06a2459a4941075779286952b7251a97382cf3604d3a77e9c4644424ff994b99f6f8ff94066543339e65084c4f16f693a3ed1567c397f2c821ea12e1b6ffb97ab37ccf0b8331'
})

