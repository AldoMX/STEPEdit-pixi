export default class Split {
  activeBlockIndex = 0;
  blocks = [];
  metadata = new Map();
  selectRandomBlockAtSplit = false;
  selectRandomBlockAtStart = false;

  rawDataSelectBlock = 0;
  rawDataBrainShower = 0;
  rawDataPadding = 0;

  get activeBlock() {
    return this.blocks[this.activeBlockIndex];
  }
}
