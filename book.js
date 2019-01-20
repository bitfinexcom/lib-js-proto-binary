const UInt64BE = require('int64-buffer').Uint64BE
const BN = require('bignumber.js')
const libCommon = require('./common')

const nBN = v => {
  return new BN(v)
}

const MSG_TYPES = {
  t_bu:
  4 + // SYM
  1 + // ACTIVE
  8 + // ID
  8 + // PRICE
  8 +  // AMOUNT
  1, // SIGN
  f_bu:
  4 + // SYM
  1 + // ACTIVE
  1 + // ID
  8 + // RATE
  1 + // PERIOD
  8 + // AMOUNT
  1 // SIGN
}

const getBookMsgSize = (symType) => {
  return 8 + // SEQ 
    MSG_TYPES[`${symType}_bu`]
}

const fBookCheckPoint = (symType, symId, type, seq) => {
  const msize = getBookMsgSize(symType)

  const b = Buffer.allocUnsafe(1 + 1 + msize)

  b.writeUInt8(20 + type, 0)
  b.writeUInt8(msize, 1)
  b.fill((new UInt64BE(seq)).toBuffer(), 2)
  b.writeUInt32BE(symId, 10)

  return b
}

const fBookEntry = (symType, symId, e, seq) => {
  const msize = getBookMsgSize(symType)

  const b = Buffer.allocUnsafe(1 + 1 + msize)

  b.writeUInt8(25, 0)
  b.writeUInt8(msize, 1)
  b.fill((new UInt64BE(seq)).toBuffer(), 2)
  b.writeUInt32BE(symId, 10)
  b.writeUInt8(e[6], 14)

  if (symType === 'f') {
    b.fill((new UInt64BE(e[0])).toBuffer(), 15)
    b.fill((new UInt64BE(nBN(e[3]).times(libCommon.DEF_MULTIPLIER).dp(0).toString(16), 16)).toBuffer(), 23)
    b.fill((new UInt8(e[2])).toBuffer(), 31)
    b.fill((new UInt64BE(nBN(e[4]).times(libCommon.DEF_MULTIPLIER).abs().dp(0).toString(16), 16)).toBuffer(), 32)
    b.writeUInt8(e[3] >= 0 ? 0 : 1, 40)
  } else {
    b.fill((new UInt64BE(e[0])).toBuffer(), 15)
    b.fill((new UInt64BE(nBN(e[1]).times(libCommon.DEF_MULTIPLIER).dp(0).toString(16), 16)).toBuffer(), 23)
    b.fill((new UInt64BE(nBN(e[3]).times(libCommon.DEF_MULTIPLIER).abs().dp(0).toString(16), 16)).toBuffer(), 31)
    b.writeUInt8(e[3] >= 0 ? 0 : 1, 39)
  }

  return b
}

module.exports = {
  fBookCheckPoint: fBookCheckPoint,
  fBookEntry: fBookEntry
}
