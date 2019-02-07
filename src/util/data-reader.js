const byteSize = 8;
const textDecoders = new Map();
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
    this.throwIfOutOfRange();
    const value = new Uint8Array(this.dataView.buffer, this.offset, length);
    this.skip(length);
    return value;
  }

  getBytesAsReader(length) {
    this.throwIfOutOfRange();
    const data = this.dataView.buffer.slice(this.offset, this.offset + length);
    const reader =
        new DataReader(data, this.defaultTextEncoding, this.isLittleEndian);
    this.skip(length);
    return reader;
  }

  getText(length, encoding = this.defaultTextEncoding) {
    this.throwIfOutOfRange();
    const textDecoder = getTextDecoder(encoding);
    const data = this.dataView.buffer.slice(this.offset, this.offset + length);
    const value = textDecoder.decode(data).replace(/\0+$/, '');
    this.skip(length);
    return value;
  }

  getDouble() {
    this.throwIfOutOfRange();
    const value = this.dataView.getFloat64(this.offset, this.isLittleEndian);
    this.skipDouble();
    return value;
  }

  getFloat() {
    this.throwIfOutOfRange();
    const value = this.dataView.getFloat32(this.offset, this.isLittleEndian);
    this.skipFloat();
    return value;
  }

  getInt8() {
    this.throwIfOutOfRange();
    const value = this.dataView.getInt8(this.offset);
    this.skipInt8();
    return value;
  }

  getInt16() {
    this.throwIfOutOfRange();
    const value = this.dataView.getInt16(this.offset, this.isLittleEndian);
    this.skipInt16();
    return value;
  }

  getInt32() {
    this.throwIfOutOfRange();
    const value = this.dataView.getInt32(this.offset, this.isLittleEndian);
    this.skipInt32();
    return value;
  }

  getUint8() {
    this.throwIfOutOfRange();
    const value = this.dataView.getUint8(this.offset);
    this.skipUint8();
    return value;
  }

  getUint16() {
    this.throwIfOutOfRange();
    const value = this.dataView.getUint16(this.offset, this.isLittleEndian);
    this.skipUint16();
    return value;
  }

  getUint32() {
    this.throwIfOutOfRange();
    const value = this.dataView.getUint32(this.offset, this.isLittleEndian);
    this.skipUint32();
    return value;
  }

  skip(length) {
    this.offset += Math.floor(length);
  }

  skipDouble = (length = 1) => this.skip((length * 64) / byteSize);
  skipFloat = (length = 1) => this.skip((length * 32) / byteSize);
  skipInt8 = (length = 1) => this.skip((length * 8) / byteSize);
  skipInt16 = (length = 1) => this.skip((length * 16) / byteSize);
  skipInt32 = (length = 1) => this.skip((length * 32) / byteSize);
  skipUint8 = (length = 1) => this.skip((length * 8) / byteSize);
  skipUint16 = (length = 1) => this.skip((length * 16) / byteSize);
  skipUint32 = (length = 1) => this.skip((length * 32) / byteSize);

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
