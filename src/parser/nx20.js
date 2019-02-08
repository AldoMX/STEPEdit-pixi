import * as _ from '../data/_common';
import Block from '../data/block';
import Note from '../data/note';
import Split from '../data/split';
import Step from '../data/step';

const DIVISION_NUM_PERFECT = 0;
const DIVISION_NUM_GREAT = 1;
const DIVISION_NUM_GOOD = 2;
const DIVISION_NUM_BAD = 3;
const DIVISION_NUM_MISS = 4;
const DIVISION_NUM_STEP_G = 5;
const DIVISION_NUM_STEP_W = 6;
const DIVISION_NUM_STEP_A = 7;
const DIVISION_NUM_STEP_B = 8;
const DIVISION_NUM_STEP_C = 9;
const DIVISION_STYLE_TYPE = 200;

const DivisionIdNames = [
  'num_perfect',
  'num_great',
  'num_good',
  'num_bad',
  'num_miss',
  'num_step_g',
  'num_step_w',
  'num_step_a',
  'num_step_b',
  'num_step_c',
];

const METADATA_ID_MODIFIER_SPEED = 0;
const METADATA_ID_MODIFIER_EW_RV = 1;
const METADATA_ID_MODIFIER_AC_DC = 2;
const METADATA_ID_MODIFIER_V_AP = 16;
const METADATA_ID_MODIFIER_FREEDOM = 17;
const METADATA_ID_MODIFIER_FLASH = 18;
const METADATA_ID_MODIFIER_UA_DR = 32;
const METADATA_ID_MODIFIER_SI_RI = 33;
const METADATA_ID_MODIFIER_SNAKE = 34;
const METADATA_ID_MODIFIER_ZIGZAG = 35;
const METADATA_ID_DEFAULT_NOTESKIN = 900;
const METADATA_ID_NOTESKIN_P1 = 901;
const METADATA_ID_NOTESKIN_P2 = 902;
const METADATA_ID_NOTESKIN_P3 = 903;
const METADATA_ID_NOTESKIN_P4 = 904;
const METADATA_ID_NOTESKIN_P5 = 905;
const METADATA_ID_SECTION = 1000;
const METADATA_ID_DIFFICULTY = 1001;
const METADATA_ID_COOP_PLAYERS = 1002;

const NOTE_FLAG_IS_ROW = 0x80;
const NOTE_FLAG_CAN_PRESS = 0x40;
const NOTE_FLAG_CAN_SKIP = 0x20;
const NOTE_FLAG_CAN_HOLD = 0x10;
const NOTE_FLAG_STEP_TYPE = 0x0F;

const NOTE_FLAG_DISPLAY_TOP = 0x01;
const NOTE_FLAG_DISPLAY_BOTTOM = 0x02;
const NOTE_FLAG_DISPLAY_BOTTOM_25 = 0x04;
const NOTE_FLAG_DISPLAY_SNAKE = 0x10;
const NOTE_FLAG_DISPLAY_UNRECOGNIZED = 0xE8;

const NOTE_FLAG_SLOT = 0xC0;
const NOTE_FLAG_BRAIN_SHOWER = 0x3F;

const NOTE_TYPE_ITEM = 0x01;
const NOTE_TYPE_DIVISION = 0x02;
const NOTE_TYPE_TAP = 0x03;
const NOTE_TYPE_HOLD_HEAD = 0x07;
const NOTE_TYPE_HOLD_BODY = 0x0B;
const NOTE_TYPE_HOLD_TAIL = 0x0F;

const StyleTypes = [
  'Default',
  'Versus',
  'Double',
  'Single (Collapsed)',
];

const GetStyleTypeFromId = (id) => StyleTypes[id] || `Unrecognized (id: ${id})`;

export default class Nx20Parser {
  startColumn = 0;
  columns = 0;
  isLightmap = false;

  constructor(reader) {
    this.reader = reader;
    this.step = new Step();

    reader.offset = 4;
    this.startColumn = reader.getUint32();
    this.columns = reader.getUint32();
    this.isLightmap = reader.getUint32() !== 0;
    this.step.styleType = _.GetStyleTypeFromNumColumns(this.columns);
    if (this.isLightmap || this.step.styleType === 'Light Map') {
      throw new Error('Light map steps are not supported.');
    }

    const numMetadata = reader.getUint32();
    for (let m = 0; m < numMetadata; m++) {
      this.readMetadata(this.step.metadata);
    }

    const numSplits = reader.getUint32();
    for (let s = 0; s < numSplits; s++) {
      this.readSplit();
    }
  }

  readMetadata(metadata) {
    const reader = this.reader;
    const id = reader.getUint32();
    let value;

    switch (id) {
      case METADATA_ID_MODIFIER_SPEED:
        value = reader.getFloat();
        metadata.set('speed', value);
        break;

      case METADATA_ID_MODIFIER_EW_RV:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('earthworm', 1);
        }
        if (value & 2) {
          metadata.set('random_velocity', 1);
        }
        if (value & 4294967292) {
          metadata.set(`id_${METADATA_ID_MODIFIER_EW_RV}`, value);
        }
        break;

      case METADATA_ID_MODIFIER_AC_DC:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('acceleration', 1);
        }
        if (value & 2) {
          metadata.set('deceleration', 1);
        }
        if (value & 4294967292) {
          metadata.set(`id_${METADATA_ID_MODIFIER_AC_DC}`, value);
        }
        break;

      case METADATA_ID_MODIFIER_V_AP:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('vanish', 1);
        }
        if (value & 2) {
          metadata.set('appear', 1);
        }
        if (value & 4294967292) {
          metadata.set(`id_${METADATA_ID_MODIFIER_V_AP}`, value);
        }
        break;

      case METADATA_ID_MODIFIER_FREEDOM:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('freedom', 1);
        }
        if (value & 4294967294) {
          metadata.set(`id_${METADATA_ID_MODIFIER_FREEDOM}`, value);
        }
        break;

      case METADATA_ID_MODIFIER_FLASH:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('flash', 1);
        }
        if (value & 4294967294) {
          metadata.set(`id_${METADATA_ID_MODIFIER_FLASH}`, value);
        }
        break;

      case METADATA_ID_MODIFIER_UA_DR:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('under_attack', 1);
        }
        if (value & 2) {
          metadata.set('drop', 1);
        }
        if (value & 4294967292) {
          metadata.set(`id_${METADATA_ID_MODIFIER_UA_DR}`, value);
        }
        break;

      case METADATA_ID_MODIFIER_SI_RI:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('sink', 1);
        }
        if (value & 2) {
          metadata.set('rise', 1);
        }
        if (value & 4294967292) {
          metadata.set(`id_${METADATA_ID_MODIFIER_SI_RI}`, value);
        }
        break;

      case METADATA_ID_MODIFIER_SNAKE:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('snake', 1);
        }
        if (value & 4294967294) {
          metadata.set(`id_${METADATA_ID_MODIFIER_SNAKE}`, value);
        }
        break;

      case METADATA_ID_MODIFIER_ZIGZAG:
        value = reader.getUint32();
        if (value & 1) {
          metadata.set('zigzag', 1);
        }
        if (value & 4294967294) {
          metadata.set(`id_${METADATA_ID_MODIFIER_ZIGZAG}`, value);
        }
        break;

      case METADATA_ID_DEFAULT_NOTESKIN:
        value = reader.getUint32();
        metadata.set('noteskin_default', _.GetNoteSkinName(value));
        break;

      case METADATA_ID_NOTESKIN_P1:
      case METADATA_ID_NOTESKIN_P2:
      case METADATA_ID_NOTESKIN_P3:
      case METADATA_ID_NOTESKIN_P4:
      case METADATA_ID_NOTESKIN_P5:
        value = reader.getUint32();
        metadata.set(
            `noteskin_p${id - METADATA_ID_DEFAULT_NOTESKIN}`,
            _.GetNoteSkinName(value));
        break;

      case METADATA_ID_SECTION:
        value = reader.getUint32();
        metadata.set('section', _.GetSection(value));
        break;

      case METADATA_ID_DIFFICULTY:
        value = reader.getUint32();
        metadata.set('difficulty', value);
        break;

      case METADATA_ID_COOP_PLAYERS:
        value = reader.getUint32();
        metadata.set('coop_players', value);
        break;

      // Known to have float values
      case 1210:
      case 1211:
      case 1310:
      case 1311:
      case 1410:
      case 1411:
        value = reader.getFloat();
        metadata.set(`id_${id}`, value);
        break;

      default:
        value = reader.getUint32();
        metadata.set(`id_${id}`, value);
    }
  }

  readSplit() {
    const split = new Split();
    split.rawDataSelectBlock = this.reader.getUint8();
    split.selectRandomBlockAtStart = (split.rawDataSelectBlock & 0x80) !== 0;
    split.selectRandomBlockAtSplit = (split.rawDataSelectBlock & 0x40) !== 0;
    split.rawDataBrainShower = this.reader.getUint8();
    split.rawDataPadding = this.reader.getUint16();

    const numMetadata = this.reader.getUint32();
    for (let m = 0; m < numMetadata; m++) {
      this.readMetadata(split.metadata);
    }

    const numBlocks = this.reader.getUint32();
    for (let b = 0; b < numBlocks; b++) {
      this.readBlock(split);
    }

    this.step.splits.push(split);
  }

  readBlock(split) {
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

    block.beatSplit = this.reader.getUint8();
    block.beatMeasure = this.reader.getUint8();
    block.isSmoothSpeed = this.reader.getUint8() !== 0;
    block.rawPadding = this.reader.getUint8();
    block.scroll *= block.beatSplit;

    const numDivision = this.reader.getUint32();
    for (let d = 0; d < numDivision; d++) {
      this.readDivision(block.division);
    }

    block.numRows = this.reader.getUint32();
    for (let r = 0; r < block.numRows; r++) {
      const row = this.readRow();
      if (row.size > 0) {
        block.rows.set(r, row);
      }
    }

    split.blocks.push(block);
  }

  readDivision(division) {
    const reader = this.reader;
    const id = reader.getUint32();
    let minValue, maxValue;

    switch (id) {
      case DIVISION_NUM_PERFECT:
      case DIVISION_NUM_GREAT:
      case DIVISION_NUM_GOOD:
      case DIVISION_NUM_BAD:
      case DIVISION_NUM_MISS:
      case DIVISION_NUM_STEP_G:
      case DIVISION_NUM_STEP_W:
      case DIVISION_NUM_STEP_A:
      case DIVISION_NUM_STEP_B:
      case DIVISION_NUM_STEP_C:
        minValue = reader.getUint16();
        maxValue = reader.getUint16();
        if (minValue > 0 || maxValue > 0) {
          division.set(DivisionIdNames[id].replace(/^num/, 'min'), minValue);
          division.set(DivisionIdNames[id].replace(/^num/, 'max'), maxValue);
        }
        break;

      case DIVISION_STYLE_TYPE:
        minValue = reader.getUint32();
        division.set('style_type', GetStyleTypeFromId(minValue));
        break;

      default:
        minValue = reader.getUint32();
        division.set(`id_${id}`, minValue);
    }
  }

  readRow() {
    const row = new Map();
    for (let c = 0; c < this.columns; c++) {
      const rawNote = this.reader.getBytes(4);
      const isEmptyRow = (rawNote[0] & NOTE_FLAG_IS_ROW) !== 0;
      if (isEmptyRow) {
        return row;
      }

      const column = this.startColumn + c;
      const note = new Note();
      const rawNoteType = rawNote[0] & NOTE_FLAG_STEP_TYPE;
      const rawNoteSubType = rawNote[2];
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

      note.slot = (rawNote[3] & NOTE_FLAG_SLOT) >> 6;

      note.canPress = (rawNote[0] & NOTE_FLAG_CAN_PRESS) !== 0;
      note.canMiss = (rawNote[0] & NOTE_FLAG_CAN_SKIP) === 0;
      note.canHold = (rawNote[0] & NOTE_FLAG_CAN_HOLD) !== 0;
      note.canRepeat = !note.canHold && _.NoteTypesHold.includes(note.type);

      var rawDisplayTop = (rawNote[1] & NOTE_FLAG_DISPLAY_TOP) !== 0;
      var rawDisplayBottom = (rawNote[1] & NOTE_FLAG_DISPLAY_BOTTOM) !== 0;
      var rawDisplayBottom25 = (rawNote[1] & NOTE_FLAG_DISPLAY_BOTTOM_25) !== 0;
      if (rawDisplayBottom25) {
        note.displayTop = rawDisplayTop;
        note.displayMiddleTop = rawDisplayTop;
        note.displayMiddleBottom = rawDisplayTop;
        note.displayBottom = !rawDisplayTop;
      } else {
        note.displayTop = rawDisplayTop;
        note.displayMiddleTop = rawDisplayTop;
        note.displayMiddleBottom = rawDisplayBottom;
        note.displayBottom = rawDisplayBottom;
      }

      note.isPathSnake = (rawNote[1] & NOTE_FLAG_DISPLAY_SNAKE) !== 0;

      note.rawDisplayUnrecognized = rawNote[1] & NOTE_FLAG_DISPLAY_UNRECOGNIZED;
      note.rawBrainShower = rawNote[3] & NOTE_FLAG_BRAIN_SHOWER;

      row.set(column, note);
    }
    return row;
  }
}
