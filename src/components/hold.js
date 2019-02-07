import React, {Component} from 'react';
import {Container, Sprite} from '@inlet/react-pixi';
import {Graphics, Texture} from 'pixi.js';
import isEqual from 'lodash.isequal';

const maskYByCol = {
  'DOWNLEFT': 24,
  'UPLEFT': 12,
  'CENTER': 18,
  'UPRIGHT': 12,
  'DOWNRIGHT': 24,
};

class Hold extends Component {
  delta = 0;
  numFrames = 6;
  speed = 30;
  tailMask = null;
  tailMaskLastRect = null;

  state = {
    textures: {
      head: Texture.EMPTY,
      body: Texture.EMPTY,
      tail: Texture.EMPTY,
    }
  };

  componentDidMount() {
    this.props.ticker.add(this.tick);
  }

  componentWillUnmount() {
    this.props.ticker.remove(this.tick);
  }

  tick =
      (delta) => {
        this.delta += delta;
        this.delta %= this.speed;
        const head = this.getTexture('HEAD');
        const body = this.getTexture('BODY');
        const tail = this.getTexture('TAIL');
        const textures = {head, body, tail};
        if (!isEqual(this.state.textures, textures)) {
          this.setState({textures});
        }
      }

  getTexture =
      (segment) => {
        const {skin, type, col} = this.props;
        const frame = Math.floor(this.delta * this.numFrames / this.speed);
        return Texture.fromFrame(
            `${skin}_${type}${segment}_${col}_F${frame}.png`);
      }

  getTailMask(x, y, width, height) {
    const rect = { x, y, width, height };
    if (this.tailMask == null || !isEqual(rect, this.tailMaskLastRect)) {
      const tailMask = new Graphics();
      tailMask.beginFill(0xff0000);
      tailMask.drawRect(x, y, width, height);
      tailMask.endFill();
      this.tailMask = tailMask;
      this.tailMaskLastRect = rect;
    }
    return this.tailMask;
  }

  render() {
    const { head, body, tail } = this.state.textures;
    const { anchor = [0.5, 0.5], col, height, x, y } = this.props;
    const maskY = maskYByCol[col];
    const bodyHeight = Math.max(height - maskY, 0);
    const tailMask = this.getTailMask(x, y + maskY, 64, 64 + bodyHeight);
    return (
      <Container anchor={anchor} x={x} y={y}>
        <Sprite texture={tail} y={height} mask ={tailMask} />
        <Sprite texture={body} y={maskY} height={bodyHeight} />
        <Sprite texture={head} y={0} />
      </Container>
    );
  }
}

export default Hold;
