export const BoolOnOffValues = {
  true: 'ON',
  false: 'OFF',
};

export const BoolYNValues = {
  true: 'Y',
  false: 'N',
};

export const NoteDivisionNames = [
  'G',
  'W',
  'A',
  'B',
  'C'
];

export const GetValidNoteDivisionId = (id) => {
  if (typeof NoteDivisionNames[id] === 'string') {
    return id;
  }
  return 0;
}

export const GetNoteDivisionName = (id) => {
  return NoteDivisionNames[id] || `Unrecognized Division (id: ${id})`;
}

export const NoteItemNames = [
  'Action',
  'Shield',
  'Charge',
  'Acceleration',
  'Flash',
  'Mine (Exceed 2 Battle)',
  'Mine',
  'Attack',
  'Drain',
  'Heart',
  '2x Speed',
  'Random Item',
  '3x Speed',
  '4x Speed',
  '8x Speed',
  '1x Speed',
  'Potion',
  'Rotate 0',
  'Rotate 90',
  'Rotate 180',
  'Rotate 270',
  'Random Speed',
  'Bomb',
  'Hyper Potion',
];

export const GetValidNoteItemId = (id) => {
  if (typeof NoteItemNames[id] === 'string') {
    return id;
  }
  return 0;
}

export const GetNoteItemName = (id) => {
  return NoteItemNames[id] || `Unrecognized Item (id: ${id})`;
}

export const NoteItemSprites = [
  'ACTION',
  'SHIELD',
  'CHARGE',
  'ACCELERATION',
  'FLASH',
  'MINE',
  'MINE_LAYER',
  'ATTACK',
  'DRAIN',
  'HEART',
  '2X_SPEED',
  'RANDOM',
  '3X_SPEED',
  '4X_SPEED',
  '8X_SPEED',
  '1X_SPEED',
  'POTION',
  'ROTATE_0',
  'ROTATE_90',
  'ROTATE_180',
  'ROTATE_270',
  'RANDOM_SPEED',
  'BOMB',
  'HYPER_POTION',
];

export const NoteSkinNames = [
  'Default',
  'Korean Trump',
  'Old',
  'Easy',
  'Slime',
  'Music',
  'Canon-D',
  'Poker',
  'NX',
  'Lamb',
  'Horse',
  'Dog',
  'Girl',
  'Fire',
  'Ice',
  'Wind',
  'Left',
  'Right',
  'Left & Right',
  'NX Absolute',
  'NX 2',
  'Lightning',
  'Drum',
  'Missile',
  'Drum (Blue)',
  'Drum (Red)',
  'Drum (Yellow)',
  'Football',
  'Rebirth',
  'Basic Mode',
  'Fiesta',
  'Fiesta 2',
  'Prime',
];

export const GetNoteSkinName = (id) => {
  if (id === 254) {
    return 'Random';
  }
  return NoteSkinNames[id] || `Unrecognized (id: ${id})`;
}

export const GetValidNoteSkinId = (id) => {
  if (typeof NoteSkinNames[id] === 'string') {
    return id;
  }
  return 0;
}

export const NoteTypes = [
  'empty',
  'item',
  'division',
  'tap',
  'hold_head',
  'hold_body',
  'hold_tail',
];

export const NoteTypeNames = [
  'Empty',
  'Item',
  'Division',
  'Tap',
  'Hold (Head)',
  'Hold (Body)',
  'Hold (Tail)',
];

export const NoteTypesHold = [
  NoteTypes.indexOf('hold_head'),
  NoteTypes.indexOf('hold_body'),
  NoteTypes.indexOf('hold_tail'),
];

export const NoteTypesRegular = [
  NoteTypes.indexOf('tap'),
  ...NoteTypesHold,
];

const SectionsById = {
  1: 'Normal',
  2: 'Mission',
  3: 'Battle',
};

export const GetSection = (id) => {
  const section = SectionsById[id];
  if (typeof section !== 'string') {
    throw new Error('Unrecognized section.');
  }
  return section;
};

const StyleTypesByNumColumns = {
  3: 'Light Map',
  5: 'Single',
  6: 'Half Double',
  10: 'Double',
};

export const GetStyleTypeFromNumColumns = (numColumns) => {
  const styleType = StyleTypesByNumColumns[numColumns];
  if (typeof styleType !== 'string') {
    throw new Error('Unrecognized number of columns.');
  }
  return styleType;
};
