const numberFormat = new Intl.NumberFormat('en-US', {minimumFractionDigits: 3});

export default class Block {
  division = new Map();
  rows = new Map();
  numRows = 0;

  startTime = 0;
  bpm = 120;
  scroll = 1;
  delay = 0;
  offset = 0;
  speed = 1;
  isFreeze = false;
  isSmoothSpeed = false;

  beatSplit = 2;
  beatMeasure = 4;

  rawPadding = 0;

  toString() {
    return [
      `Start Time: ${numberFormat.format(this.startTime)}`,
      this.delay !== 0 ? `Freeze: ${numberFormat.format(this.delay)}` :
                         `Offset: ${numberFormat.format(this.offset)}`,
      `BPM: ${numberFormat.format(this.bpm)}`,
      `Beats per Measure: ${this.beatMeasure}`,
      `Beat Split: ${this.beatSplit}`,
      `Speed: ${numberFormat.format(this.speed)}${
          this.isSmoothSpeed ? ' (S)' : ''}`,
      `Scroll: ${numberFormat.format(this.scroll)}`,
      `Num. Rows: ${this.numRows}`,
      `Num. Division: ${this.division.size}`,
    ].join('\n');
  }
}
