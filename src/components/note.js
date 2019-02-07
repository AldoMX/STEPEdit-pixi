import React, {Component} from 'react';
import {Sprite, Container} from '@inlet/react-pixi';
import * as PIXI from 'pixi.js'

class Note extends Component {
  delta = 0;
  numFrames = 6;
  speed = 30;

  state = {
    texture: PIXI.Texture.EMPTY,
  };

  componentDidMount() {
    this.props.ticker.add(this.tick);
  }

  componentWillUnmount() {
    this.props.ticker.remove(this.tick);
  }

  setCol =
      (col) => {
        this.setState(() => ({col}));
      }

  setType =
      (type) => {
        this.setState(() => ({type}));
      }

  tick =
      (delta) => {
        this.delta += delta;
        this.delta %= this.speed;
        const texture = this.getTexture();
        this.setState(() => ({texture}));
      }

  getTexture =
      () => {
        const {skin, type, col} = this.props;
        const frame = Math.floor(this.delta * this.numFrames / this.speed);
        return PIXI.Texture.fromFrame(`${skin}_${type}_${col}_F${frame}.png`);
      }

  render() {
    const {texture} = this.state;
    const {anchor = [0.5, 0.5], x = 0, y = 0} = this.props;
    return (
      <Container anchor={anchor} x={x} y={y}>
        <Sprite texture={texture} />
      </Container>
    );
  }

  static loadAssets(callback, skin = '00') {
    PIXI.loader
      .add(`noteskin/${skin}/0.frames.json`)
      .add(`noteskin/${skin}/1.frames.json`)
      .add(`noteskin/${skin}/2.frames.json`)
      .add(`noteskin/${skin}/3.frames.json`)
      .add(`noteskin/${skin}/4.frames.json`)
      .add(`noteskin/${skin}/5.frames.json`)
      .add(`noteskin/${skin}/6.frames.json`)
      .add(`noteskin/${skin}/base.frames.json`)
      .add(`noteskin/${skin}/hd1.frames.json`)
      .add(`noteskin/${skin}/hd2.frames.json`)
      .add(`noteskin/${skin}/stepfx0.frames.json`)
      .add(`noteskin/${skin}/stepfx1.frames.json`)
      .add(`noteskin/${skin}/stepfx2.frames.json`)
      .add(`noteskin/${skin}/stepfx3.frames.json`)
      .add(`noteskin/${skin}/stepfx4.frames.json`)
      .load(callback);
  }
}

export default Note;
