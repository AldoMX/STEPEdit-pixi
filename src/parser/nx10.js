import * as _ from '../data/_common';
import Block from '../data/block';
import Note from '../data/note';
import Split from '../data/split';
import Step from '../data/step';

const NOTE_FLAG_CAN_PRESS = 0x80;
const NOTE_FLAG_CAN_SKIP = 0x40;
const NOTE_FLAG_DISPLAY_TOP = 0x20;
const NOTE_FLAG_DISPLAY_BOTTOM = 0x10;
const NOTE_FLAG_STEP_TYPE = 0x07;
const NOTE_FLAG_STEP_SUBTYPE = 0xFC;
const NOTE_FLAG_SLOT = 0x03;

const NOTE_TYPE_ITEM = 0x01;
const NOTE_TYPE_DIVISION = 0x02;
const NOTE_TYPE_TAP = 0x03;
const NOTE_TYPE_HOLD_HEAD = 0x04;
const NOTE_TYPE_HOLD_BODY = 0x06;
const NOTE_TYPE_HOLD_TAIL = 0x07;

export default class Nx10Parser {
  startColumn = 0;
  columns = 0;
  isLightmap = false;

  constructor(reader) {
    this.reader = reader;
    this.step = new Step();

    this.reader.offset = 4;
    this.startColumn = this.reader.getUint32();
    this.columns = this.reader.getUint32();
    this.isLightmap = this.startColumn > 9;
    this.step.styleType = _.GetStyleTypeFromNumColumns(this.columns);
    if (this.isLightmap || this.step.styleType === 'Light Map') {
      throw new Error('Light map steps are not supported.');
    }

    const numSplits = this.reader.getUint32();
    const splitOffsets = this.reader.getUint32Array(numSplits);
    for (let s = 0; s < numSplits; s++) {
      this.readSplit(splitOffsets[s]);
    }
  }

  readSplit(offset) {
    if (offset === 0) {
      return;
    }
    this.reader.offset = offset;

    const split = new Split();
    const numBlocks = this.reader.getUint32();
    const blockOffsets = this.reader.getUint32Array(numBlocks);
    for (let b = 0; b < numBlocks; b++) {
      this.readBlock(split, blockOffsets[b]);
    }

    // The select random block behavior was hardcoded in PIU NX2
    if (split.activeBlock.division.has('max_perfect')) {
      const maxValue = split.activeBlock.division.get('max_perfect');
      const minValue = split.activeBlock.division.get('min_perfect');
      if (maxValue === 0) {
        split.selectRandomBlockAtStart = minValue >= 1;
        split.selectRandomBlockAtSplit = minValue >= 2;
        split.activeBlock.division.delete('max_perfect');
        split.activeBlock.division.delete('min_perfect');
      }
    }

    this.step.splits.push(split);
  }

  readBlock(split, offset) {
    if (offset === 0) {
      return;
    }
    this.reader.offset = offset;

    const block = new Block();
    block.startTime = this.reader.getFloat();
    block.bpm = this.reader.getFloat();
    block.scroll = this.reader.getFloat();
    block.delay = 0;
    block.offset = this.reader.getFloat();
    block.speed = this.reader.getFloat();
    block.isFreeze = block.speed < 0;
    if (block.isFreeze) {
      block.speed = -block.speed;
      block.delay = block.offset;
      block.offset = 0;
    }

    const divisionOffset = this.reader.getUint32();
    block.beatSplit = this.reader.getUint16();
    block.beatMeasure = this.reader.getUint8();
    block.isSmoothSpeed = this.reader.getUint8() !== 0;
    block.scroll *= block.beatSplit;

    block.numRows = this.reader.getUint32();
    const rowOffsets = this.reader.getUint32Array(block.numRows);
    for (let r = 0; r < block.numRows; r++) {
      const row = this.readRow(rowOffsets[r]);
      if (row.size > 0) {
        block.rows.set(r, row);
      }
    }
    this.readDivision(block.division, divisionOffset);
    split.blocks.push(block);
  }

  readDivision(division, offset) {
    if (offset === 0) {
      return;
    }
    this.reader.offset = offset;

    const minValues = this.reader.getUint32Array(_.DivisionIdNames.length);
    const maxValues = this.reader.getUint32Array(_.DivisionIdNames.length);
    for (let d = 0; d < _.DivisionIdNames.length; d++) {
      const minValue = minValues[d];
      const maxValue = maxValues[d];
      if (minValue === 0 && maxValue === 0) {
        continue;
      }
      division.set(_.DivisionIdNames[d].replace(/^num/, 'min'), minValue);
      division.set(_.DivisionIdNames[d].replace(/^num/, 'max'), maxValue);
    }
  }

  readRow(offset) {
    const row = new Map();
    if (offset === 0) {
      return row;
    }
    this.reader.offset = offset;

    for (let c = 0; c < this.columns; c++) {
      const rawNote = this.reader.getBytes(2);
      const column = this.startColumn + c;
      const note = new Note();
      const rawNoteType = rawNote[0] & NOTE_FLAG_STEP_TYPE;
      const rawNoteSubType = (rawNote[1] & NOTE_FLAG_STEP_SUBTYPE) >> 2;
      switch (rawNoteType) {
        case NOTE_TYPE_ITEM:
          note.type = _.NoteTypes.indexOf('item');
          note.subType = _.GetValidNoteItemId(rawNoteSubType);
          break;

        case NOTE_TYPE_DIVISION:
          note.type = _.NoteTypes.indexOf('division');
          note.subType = _.GetValidNoteDivisionId(rawNoteSubType);
          break;

        case NOTE_TYPE_TAP:
          note.type = _.NoteTypes.indexOf('tap');
          note.subType = _.GetValidNoteSkinId(rawNoteSubType);
          break;

        case NOTE_TYPE_HOLD_HEAD:
          note.type = _.NoteTypes.indexOf('hold_head');
          note.subType = _.GetValidNoteSkinId(rawNoteSubType);
          break;

        case NOTE_TYPE_HOLD_BODY:
          note.type = _.NoteTypes.indexOf('hold_body');
          note.subType = _.GetValidNoteSkinId(rawNoteSubType);
          break;

        case NOTE_TYPE_HOLD_TAIL:
          note.type = _.NoteTypes.indexOf('hold_tail');
          note.subType = _.GetValidNoteSkinId(rawNoteSubType);
          break;

        default:
          continue;
      }

      note.slot = rawNote[1] & NOTE_FLAG_SLOT;

      note.canPress = (rawNote[0] & NOTE_FLAG_CAN_PRESS) !== 0;
      note.canMiss = (rawNote[0] & NOTE_FLAG_CAN_SKIP) === 0;
      note.canHold = _.NoteTypesHold.includes(note.type) && note.canPress;

      var rawDisplayTop = (rawNote[0] & NOTE_FLAG_DISPLAY_TOP) !== 0;
      var rawDisplayBottom = (rawNote[0] & NOTE_FLAG_DISPLAY_BOTTOM) !== 0;
      note.displayTop = rawDisplayTop;
      note.displayMiddleTop = rawDisplayTop;
      note.displayMiddleBottom = rawDisplayBottom;
      note.displayBottom = rawDisplayBottom;

      row.set(column, note);
    }
    return row;
  }
}
