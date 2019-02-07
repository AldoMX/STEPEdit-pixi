const sizeByte = 8;
const textDecoders = Map();
const getTextDecoder = (encoding) => {
  if (typeof window.TextDecoder == 'undefined') {
    console.warn(
        'TextDecoder is not supported in your browser, text may not be read correctly.');
    encoding = null;
  }
  if (!textDecoders.has(encoding)) {
    if (encoding == null) {
      encoding = null;
      textDecoders.set(encoding, {decode: text => text});
    } else {
      textDecoders.set(encoding, new TextDecoder(encoding));
    }
  }
  return textDecoders.get(encoding);
};

class DataReader {
  constructor(data, defaultTextEncoding = 'utf-8', isLittleEndian = true) {
    this.offset = 0;
    this.defaultTextEncoding = defaultTextEncoding;
    this.isLittleEndian = isLittleEndian;
    this.dataView = new DataView(data);
  }

  getBytes(length) {
    throwIfOutOfRange();
    const value = new Uint8Array(this.dataView.buffer, this.offset, length);
    skip(length);
    return value;
  }

  getBytesAsReader(length) {
    throwIfOutOfRange();
    const data = this.dataView.buffer.slice(this.offset, this.offset + length);
    const reader =
        new DataReader(data, this.defaultTextEncoding, this.isLittleEndian);
    skip(length);
    return reader;
  }

  getText(length, encoding = this.defaultTextEncoding) {
    throwIfOutOfRange();
    const textDecoder = getTextDecoder(encoding);
    const data = this.dataView.buffer.slice(this.offset, this.offset + length);
    const value = textDecoder.decode(data).replace(/\0+$/, '');
    skip(length);
    return value;
  }

  getDouble() {
    throwIfOutOfRange();
    const value = this.dataView.getFloat64(this.offset, this.isLittleEndian);
    skipDouble();
    return value;
  }

  getFloat() {
    throwIfOutOfRange();
    const value = this.dataView.getFloat32(this.offset, this.isLittleEndian);
    skipFloat();
    return value;
  }

  getInt8() {
    throwIfOutOfRange();
    const value = this.dataView.getInt8(this.offset);
    skipInt8();
    return value;
  }

  getInt16() {
    throwIfOutOfRange();
    const value = this.dataView.getInt16(this.offset, this.isLittleEndian);
    skipInt16();
    return value;
  }

  getInt32() {
    throwIfOutOfRange();
    const value = this.dataView.getInt32(this.offset, this.isLittleEndian);
    skipInt32();
    return value;
  }

  getUint8() {
    throwIfOutOfRange();
    const value = this.dataView.getUint8(this.offset);
    skipUint8();
    return value;
  }

  getUint16() {
    throwIfOutOfRange();
    const value = this.dataView.getUint16(this.offset, this.isLittleEndian);
    skipUint16();
    return value;
  }

  getUint32() {
    throwIfOutOfRange();
    const value = this.dataView.getUint32(this.offset, this.isLittleEndian);
    skipUint32();
    return value;
  }

  skip(length) {
    this.offset += Math.floor(length);
  }

  skipDouble = (length = 1) => skip((length * 64) / sizeByte);
  skipFloat = (length = 1) => skip((length * 32) / sizeByte);
  skipInt8 = (length = 1) => skip((length * 8) / sizeByte);
  skipInt16 = (length = 1) => skip((length * 16) / sizeByte);
  skipInt32 = (length = 1) => skip((length * 32) / sizeByte);
  skipUint8 = (length = 1) => skip((length * 8) / sizeByte);
  skipUint16 = (length = 1) => skip((length * 16) / sizeByte);
  skipUint32 = (length = 1) => skip((length * 32) / sizeByte);

  throwIfOutOfRange() {
    if (this.offset >= this.dataView.byteLength) {
      throw new Error('DataReader Error: EOF reached.');
    }
    if (this.offset < 0) {
      throw new Error(
          'DataReader Error: Offset should be greater than or equal to zero.');
    }
  }
}

export default DataReader;
