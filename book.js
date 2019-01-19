const UInt64BE = require('int64-buffer').Uint64BE
const BN = require('bignumber.js')
const libCommon = require('./common')

const nBN = v => {
  return new BN(v)
}

const MSG_TYPES = {
  t_bu_a:
  4 + // SYM
  8 + // PRICE
  4 + // CNT
  8,  // AMOUNT
  t_bu_r:
  4 + // SYM
  8 + // ID
  8 + // PRICE
  8, // AMOUNT
  f_bu_a:
  4 + // SYM
  8 + // RATE
  2 + // PERIOD
  4 + // CNT
  8, // AMOUNT
  f_bu_r:
  4 + // SYM
  8 + // ID
  8 + // PERIOD
  8 + // RATE
  8 // AMOUNT
}

const getBookMsgSize = (symType, prl) => {
  const sfx = prl[0] === 'R' ? 'r' : 'a'

  return 8 + // SEQ 
    MSG_TYPES[`${symType}_bu_${sfx}`]
}

const fBookCheckPoint = (symType, symId, prl, type, seq) => {
  const msize = getBookMsgSize(symType, prl)

  const b = Buffer.allocUnsafe(1 + 1 + msize)

  b.writeUInt8(20 + type, 0)
  b.writeUInt8(msize, 1)
  b.fill((new UInt64BE(seq)).toBuffer(), 2)
  b.writeUInt32BE(symId, 10)

  return b
}

const fBookEntry = (symType, symId, prl, e, seq) => {
  const msize = getBookMsgSize(symType, prl)

  const b = Buffer.allocUnsafe(1 + 1 + msize)

  b.writeUInt8(25, 0)
  b.writeUInt8(msize, 1)
  b.fill((new UInt64BE(seq)).toBuffer(), 2)
  b.writeUInt32BE(symId, 10)

  if (symType === 'f') {

  } else {
    if (prl[0] === 'R') {
      b.fill((new UInt64BE(e[1])).toBuffer(), 14)
      b.fill((new UInt64BE(nBN(e[3]).mul(libCommon.DEF_MULTIPLIER).dp(0).toString(16), 16)).toBuffer(), 20)
      b.fill((new UInt64BE(nBN(e[4]).mul(libCommon.DEF_MULTIPLIER).dp(0).toString(16), 16)).toBuffer(), 28)
    } else {
      b.fill((new UInt64BE(nBN(e[1]).mul(libCommon.DEF_MULTIPLIER).dp(0).toString(16), 16)).toBuffer(), 14)
      b.fill((new UInt64BE(e[3])).toBuffer(), 20)
      b.fill((new UInt64BE(nBN(e[4]).mul(libCommon.DEF_MULTIPLIER).dp(0).toString(16), 16)).toBuffer(), 28)
    }
  }

  return b
}

module.exports = {
  fBookCheckPoint: fBookCheckPoint,
  fBookEntry: fBookEntry,
}
