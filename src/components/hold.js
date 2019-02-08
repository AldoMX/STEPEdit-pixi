import {PixiComponent} from '@inlet/react-pixi';
import {Container, extras, Graphics, Texture} from 'pixi.js';

const maskYByCol = {
  'DOWNLEFT': 24,
  'UPLEFT': 12,
  'CENTER': 18,
  'UPRIGHT': 12,
  'DOWNRIGHT': 24,
};

const numFrames = 6;

export default PixiComponent('HoldComponent', {
  create: () => new Container(),
  applyProps: (container, oldProps, newProps) => {
    container.removeChildren();
    const {anchor = [0.5, 0.5], x = 0, y = 0} = newProps;
    container.anchor = anchor;
    container.x = x;
    container.y = y;

    const {col, skin, type} = newProps;
    const headTextures = [];
    const bodyTextures = [];
    const tailTextures = [];
    for (let frame = 0; frame < numFrames; frame++) {
      headTextures.push(
          Texture.fromFrame(`${skin}_${type}HEAD_${col}_F${frame}.png`));
      bodyTextures.push(
          Texture.fromFrame(`${skin}_${type}BODY_${col}_F${frame}.png`));
      tailTextures.push(
          Texture.fromFrame(`${skin}_${type}TAIL_${col}_F${frame}.png`));
    }

    const {height} = newProps;
    const maskY = maskYByCol[col];
    const bodyHeight = Math.max(height - maskY, 0);
    const tailMask = new Graphics();
    tailMask.beginFill(0xff0000);
    tailMask.drawRect(x, y + maskY, 64, 64 + bodyHeight);
    tailMask.endFill();

    const tailAnimatedSprite =
        container.addChild(new extras.AnimatedSprite(tailTextures));
    tailAnimatedSprite.animationSpeed = 0.25;
    // tailAnimatedSprite.mask = tailMask;
    tailAnimatedSprite.y = height;
    tailAnimatedSprite.play();

    const bodyAnimatedSprite =
        container.addChild(new extras.AnimatedSprite(bodyTextures));
    bodyAnimatedSprite.animationSpeed = 0.25;
    bodyAnimatedSprite.height = bodyHeight;
    bodyAnimatedSprite.y = maskY;
    bodyAnimatedSprite.play();

    const headAnimatedSprite =
        container.addChild(new extras.AnimatedSprite(headTextures));
    headAnimatedSprite.animationSpeed = 0.25;
    headAnimatedSprite.play();
  },
});
