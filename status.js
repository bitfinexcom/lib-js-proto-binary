module.exports = {
  init: () => {
    const b = Buffer.allocUnsafe(2)

    b.writeUInt8(1, 0)
    b.writeUInt8(0, 1)

    return b
  },
  stop: () => {
    const b = Buffer.allocUnsafe(2)

    b.writeUInt8(0, 0)
    b.writeUInt8(0, 1)

    return b
  }
}
