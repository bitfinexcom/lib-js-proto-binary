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

const fBookCheckPoint = (symId, prl, type) => {
  const msize = getBookMsgSize(symId, prl)

  const b = Buffer.allocUnsafe(1 + 1 + msize)

  b.writeUInt8(20 + type, 0)
  b.writeUInt8(msize, 1)
  b.fill((new UInt64BE(0)).toBuffer(), 2)
  b.writeUInt32BE(symId, 10)

  return b
}

const fBookEntry = (symId, prl, e) => {
  const msize = getBookMsgSize(symId, prl)

  const b = Buffer.allocUnsafe(1 + 1 + msize)

  b.writeUInt8(25, 0)
  b.writeUInt8(msize, 1)
  b.fill((new UInt64BE(0)).toBuffer(), 2)
  b.writeUInt32BE(symId, 10)

  if (prl[0] === 'R') {
    b.fill((new UInt64BE(e[1])).toBuffer(), 14)
    b.fill((new UInt64BE(e[2] * 100000000)).toBuffer(), 20)
    b.fill((new UInt64BE(e[3] * 100000000)).toBuffer(), 28)
  } else {
    b.fill((new UInt64BE(e[1])).toBuffer(), 14)
    b.fill((new UInt64BE(e[2])).toBuffer(), 20)
    b.fill((new UInt64BE(e[3] * 100000000)).toBuffer(), 28)
  }

  return b
}

module.exports = {
  fBookCheckPoint: fBookCheckPoint,
  fBookEntry: fBookEntry,
}
