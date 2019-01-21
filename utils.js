const BN = require('bignumber.js')

const nBN = v => {
  return new BN(v)
}

module.exports = {
  nBN: nBN
}
