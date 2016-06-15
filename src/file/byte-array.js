/*
 * A big-endian byte array that can write MIDI variable length values
 */
class ByteArray extends Array {
  writeInt32(int32) {
    this.push((int32 & 0xFF000000) >> 24);
    this.push((int32 & 0x00FF0000) >> 16);
    this.push((int32 & 0x0000FF00) >> 8);
    this.push(int32 & 0x000000FF);
  }

  writeInt16(int16) {
    this.push((int16 & 0xFF00) >> 8);
    this.push(int16 & 0x00FF);
  }

  writeInt8(int8) {
    this.push(int8 & 0xFF);
  }

  writeVariableLengthQuantity(value) {
    if (value > 0x0FFFFFFF) {
      throw new Error(`Cannot write variable length quantity ${value} because it exceeds the maximum ${0x0FFFFFFF}`);
    }
    const buffer = [value & 0x7F];
    while (value >>= 7) buffer.push((value & 0x7f) | 0x80);
    for (let i = buffer.length - 1; i >= 0; i--) {
      this.push(buffer[i] & 0xFF)
    }
  };
}

module.exports = ByteArray;