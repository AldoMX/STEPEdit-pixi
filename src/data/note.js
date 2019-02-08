import * as _ from './_common';

const NoteSkinBankNames = [
  'Default NoteSkin',
];

const getNoteSkinBankName = (i) => NoteSkinBankNames[i] || `NoteSkin ${i}`;

const divisionId = _.NoteTypes.indexOf('division');
const itemId = _.NoteTypes.indexOf('item');

const getNoteDescription = (type, subType, slot) => {
  const typeName = _.NoteTypeNames[type] || `Type ID ${type}`;
  const slotName = slot === 3 ? 'All Players' : `Player ${slot + 1}`;
  if (type === divisionId) {
    return `${typeName} (${_.GetNoteDivisionName(subType)}, ${slotName})`;
  }
  if (type === itemId) {
    return `${typeName} (${_.GetNoteItemName(subType)}, ${slotName})`;
  }
  if (_.NoteTypesRegular.includes(type)) {
    return `${typeName} (${getNoteSkinBankName(subType)}, ${slotName})`;
  }
  return `${typeName} (Sub-Type ID ${subType}, ${slotName})`;
};

const getBehaviorDescription = (press, miss, hold, repeat) => {
  press = _.BoolOnOffValues[press];
  miss = _.BoolOnOffValues[miss];
  hold = _.BoolOnOffValues[hold];
  repeat = _.BoolOnOffValues[repeat];
  return `Press ${press}, Miss ${miss}, Hold ${hold}, Repeat ${repeat}`;
};

const getDisplayDescription = (top, middleTop, middleBottom, bottom) => {
  top = _.BoolYNValues[top];
  middleTop = _.BoolYNValues[middleTop];
  middleBottom = _.BoolYNValues[middleBottom];
  bottom = _.BoolYNValues[bottom];
  return `${top}${middleTop}${middleBottom}${bottom}`;
};

export default class Note {
  type = 0;
  subType = 0;
  slot = 0;

  canPress = false;
  canMiss = false;
  canHold = false;
  canRepeat = false;

  displayTop = false;
  displayMiddleTop = false;
  displayMiddleBottom = false;
  displayBottom = false;

  isPathSnake = false;

  rawDisplayUnrecognized = 0;
  rawBrainShower = 0;

  toString() {
    return [
      `Note: ${getNoteDescription(this.type, this.subType, this.slot)}`,
      `Behavior: ${
          getBehaviorDescription(
              this.canPress, this.canMiss, this.canHold, this.canRepeat)}`,
      `Display (Top, Middle, Middle, Bottom): ${
          getDisplayDescription(
              this.displayTop, this.displayMiddleTop, this.displayMiddleBottom,
              this.displayBottom)}`,
      `Snake Path: ${_.BoolOnOffValues[this.isPathSnake]}`
    ].join('\n');
  }
}
