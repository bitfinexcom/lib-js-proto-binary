const UInt64BE = require('int64-buffer').Uint64BE
const libUtils = require('./utils')
const libCommon = require('./common')

const MSG_TYPES = {
  t_trade:
  4 + // SYM
  8 + // ID
  8 + // PRICE
  8 +  // AMOUNT
  1, // SIGN
  f_bu:
  4 + // SYM
  1 + // ID
  8 + // RATE
  1 + // PERIOD
  8 + // AMOUNT
  1 // SIGN
}

const getTradeMsgSize = (symType) => {
  return 8 + // SEQ 
    MSG_TYPES[`${symType}_trade`]
}

const fTradeEntry = (symType, symId, e, seq) => {
  const msize = getTradeMsgSize(symType)

  const b = Buffer.allocUnsafe(1 + 1 + msize)

  b.writeUInt8(35, 0)
  b.writeUInt8(msize, 1)
  b.fill((new UInt64BE(seq)).toBuffer(), 2)
  b.writeUInt32BE(symId, 10)
  b.writeUInt8(e[6], 14)

  if (symType === 'f') {
    b.fill((new UInt64BE(e.id)).toBuffer(), 15)
    b.fill((new UInt64BE(nBN(e.rate).times(libCommon.DEF_MULTIPLIER).dp(0).toString(16), 16)).toBuffer(), 23)
    b.fill((new UInt8(e.period)).toBuffer(), 31)
    b.fill((new UInt64BE(nBN(e.amount).times(libCommon.DEF_MULTIPLIER).abs().dp(0).toString(16), 16)).toBuffer(), 32)
    b.writeUInt8(+e.amount >= 0 ? 0 : 1, 40)
  } else {
    b.fill((new UInt64BE(e.id)).toBuffer(), 15)
    b.fill((new UInt64BE(nBN(e.price).times(libCommon.DEF_MULTIPLIER).dp(0).toString(16), 16)).toBuffer(), 23)
    b.fill((new UInt64BE(nBN(e.amount).times(libCommon.DEF_MULTIPLIER).abs().dp(0).toString(16), 16)).toBuffer(), 31)
    b.writeUInt8(+e.amount >= 0 ? 0 : 1, 39)
  }

  return b
}

module.exports = {
  fTradeEntry: fTradeEntry
}
