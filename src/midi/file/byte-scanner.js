class ByteScanner {

  constructor(arrayBuffer) {
    this.dataView = new DataView(arrayBuffer);
    this.position = 0; // the byte offset
  }

  uInt32() {
    const int32 = this.dataView.getUint32(this.position);
    this.position += 4;
    return int32;
  }

  uInt16() {
    const int16 = this.dataView.getUint16(this.position);
    this.position += 2;
    return int16;
  }

  uInt8() {
    const int8 = this.dataView.getUint8(this.position);
    this.position += 1;
    return int8;
  }

  variableLengthQuantity() {
    let data = 0;
    let byte = this.uInt8();
    while (byte & 0x80) {
      data = (data << 7) + (byte & 0x7F);
      byte = this.uInt8();
    }
    return (data << 7) + (byte & 0x7F);
  }

  backtrack(bytes) {
    this.position -= bytes;
  }

  position() {
    return this.position;
  }

  isBefore(offset) {
    return this.position < offset;
  }
}

module.exports = ByteScanner;