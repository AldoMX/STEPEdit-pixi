class Block {
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
}

export default Block;
