import DataReader from '../util/data-reader';
import Nx10Parser from './nx10';
import Nx20Parser from './nx20';

const nx10Signature = 808540238;
const nx20Signature = 808605774;

export default class NxParser {
  constructor(filename, data) {
    this.reader = new DataReader(data, 'euc-kr');
    const signature = this.reader.getUint32();
    let step;
    try {
      switch (signature) {
        case nx10Signature:
          ({step} = new Nx10Parser(this.reader));
          break;

        case nx20Signature:
          ({step} = new Nx20Parser(this.reader));
          break;

        default:
          throw new Error(
              'Unrecognized file signature, expected NX10 or NX20.');
      }
    } catch (e) {
      throw new Error(`Error parsing ${filename}: ${e.message}`);
    }
    this.step = step;
  }
}
