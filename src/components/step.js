import {Container} from '@inlet/react-pixi';
import React, {Component} from 'react';

import * as _ from '../data/_common';

import HoldComponent from './hold';
import NoteComponent from './note';
import NoteSpecialComponent from './note-special';
import SplitGrid from './split-grid';

const beatHeight = 60;
const speed = 2;

const divisionId = _.NoteTypes.indexOf('division');
const itemId = _.NoteTypes.indexOf('item');
const subTypeA = _.NoteDivisionNames.indexOf('A');

const cols = [
  'DOWNLEFT',
  'UPLEFT',
  'CENTER',
  'UPRIGHT',
  'DOWNRIGHT',
];

const offsetsByCol = {
  5: [
    -100,
    -50,
    0,
    50,
    100,
  ],
  6: [
    -235,
    -185,
    -135,
    -85,
    -35,
    35,
    85,
    135,
    185,
    235,
  ],
  10: [
    -235,
    -185,
    -135,
    -85,
    -35,
    35,
    85,
    135,
    185,
    235,
  ],
};

class StepComponent extends Component {
  state = {
    components: [],
    showMetaData: false,
  };

  constructor(props) {
    super(props);
    const originalSetState = this.setState;
    this.setState = (state) => Object.assign(this.state, state);
    this.setStep(this.props.step, true);
    this.setState = originalSetState;
  }

  componentWillUpdate(newProps) {
    if (newProps.step !== this.props.step) {
      const {step} = newProps;
      this.setStep(step);
    }
  }

  render() {
    const {components} = this.state;
    return (
      <Container y={this.props.y - 32}>
        {components.map(({componentType, props}, key) => React.createElement(componentType, { key, ...props }))}
      </Container>
    );
  }

  setStep(step) {
    console.log('Step Metadata:');
    console.dir(step.metadata);
    this.setStyle(step);
    const components = this.updateComponentData(step);
    this.setState({ step, components });
  }

  setStyle(step) {
    // TODO: Receptors
    switch (step.styleType) {
      case 'Light Map':
        this.columns = 3;
        break;

      case 'Single':
        this.columns = 5;
        break;

      case 'Half Double':
        this.columns = 10;
        break;

      case 'Double':
        this.columns = 10;
        break;

      default:
        throw new Error(`Unrecognized style type: ${step.styleType}`);
    }
  }

  showMetaData(showMetaData) {
    this.setState({showMetaData});
  }

  updateComponentData(step) {
    const components = [];
    this.updateSplitGrid(components, step);
    this.updateNotes(components, step);
    return components;
  }

  updateNotes(components, step) {
    const activeHoldProps = new Map();
    let splitGridY = this.props.y;
    for (const split of step.splits) {
      const {beatSplit, numRows} = split.activeBlock;
      for (const [rowIndex, row] of split.activeBlock.rows.entries()) {
        for (const [column, note] of row.entries()) {
          let componentData;
          if (!_.NoteTypesRegular.includes(note.type)) {
            if (note.type === itemId) {
              componentData = {
                componentType: NoteSpecialComponent,
                props: {
                  type: 'ITEM',
                  subType: _.NoteItemSprites[note.subType],
                  x: this.props.x + offsetsByCol[this.columns][column],
                  y: splitGridY + beatHeight * speed * (rowIndex / beatSplit),
                },
              };
              components.push(componentData);
            } else if (note.type === divisionId) {
              componentData = {
                componentType: NoteSpecialComponent,
                props: {
                  type: 'DIVISION',
                  subType: _.NoteDivisionNames[note.subType],
                  numFrames: note.subType >= subTypeA ? 1 : 6,
                  x: this.props.x + offsetsByCol[this.columns][column],
                  y: splitGridY + beatHeight * speed * (rowIndex / beatSplit),
                },
              };
              components.push(componentData);
            }
          } else if (_.NoteTypesHold.includes(note.type)) {
            const isHead = note.type === _.NoteTypesHold[0];
            const isTail = note.type === _.NoteTypesHold[2];
            if (isHead || !activeHoldProps.has(column)) {
              componentData = {
                componentType: HoldComponent,
                props: {
                  skin: 'SKIN00',
                  type: note.canHold ? 'HOLD' : 'ROLL',
                  col: cols[column % cols.length],
                  height: 0,
                  x: this.props.x + offsetsByCol[this.columns][column],
                  y: splitGridY + beatHeight * speed * (rowIndex / beatSplit),
                },
              };
              activeHoldProps.set(column, componentData.props);
              components.push(componentData);
            } else {
              const props = activeHoldProps.get(column);
              const y = splitGridY + beatHeight * speed * (rowIndex / beatSplit);
              props.height = y - props.y;
            }
            if (isTail) {
              activeHoldProps.delete(column);
            }
          } else {
            componentData = {
              componentType: NoteComponent,
              props: {
                skin: 'SKIN00',
                type: 'TAP',
                col: cols[column % cols.length],
                x: this.props.x + offsetsByCol[this.columns][column],
                y: splitGridY + beatHeight * speed * (rowIndex / beatSplit),
              },
            };
            components.push(componentData);
          }
        }
      }
      splitGridY += beatHeight * speed * (numRows / beatSplit);
    }
  }

  updateSplitGrid(components, step) {
    let maxBlocks = 0;
    let numMeasures = 0;
    for (const split of step.splits) {
      let numMeasuresSplit = 0;
      for (const block of split.blocks) {
        numMeasuresSplit = Math.max(
            numMeasuresSplit,
            block.numRows / (block.beatSplit * block.beatMeasure));
      }
      maxBlocks = Math.max(maxBlocks, split.blocks.length);
      numMeasures += Math.ceil(numMeasuresSplit);
    }
    const measureMaxLength = numMeasures.toString().length;
    const blockMaxLength = maxBlocks.toString().length;
    const splitMaxLength = step.splits.length.toString().length;
    let splitGridStartMeasure = 1;
    let splitGridY = this.props.y;
    step.splits.forEach((split, splitIndex) => {
      const {beatSplit, beatMeasure, numRows} = split.activeBlock;
      const componentData = {
        componentType: SplitGrid,
        props: {
          columns: this.columns,
          blockData: {
            startTime: split.activeBlock.startTime,
            bpm: split.activeBlock.bpm,
            scroll: split.activeBlock.scroll,
            delay: split.activeBlock.delay,
            offset: split.activeBlock.offset,
            speed: split.activeBlock.speed,
            isSmoothSpeed: split.activeBlock.isSmoothSpeed,
            numDivision: split.activeBlock.division.size,
          },
          blockIndex: split.activeBlockIndex,
          splitIndex,
          beatSplit,
          beatMeasure,
          numBlocks: split.blocks.length,
          numRows,
          measureMaxLength,
          blockMaxLength,
          splitMaxLength,
          startMeasure: splitGridStartMeasure,
          x: this.props.x,
          y: splitGridY,
        },
      };
      components.push(componentData);
      splitGridStartMeasure += Math.ceil(numRows / (beatSplit * beatMeasure));
      splitGridY += beatHeight * speed * (numRows / beatSplit);
    });
  }
}

export default StepComponent;
