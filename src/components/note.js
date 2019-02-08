import {PixiComponent} from '@inlet/react-pixi';
import {Container, extras, loader, Texture} from 'pixi.js'

const numFrames = 6;

export default PixiComponent('NoteComponent', {
  create: () => new Container(),
  applyProps: (container, oldProps, newProps) => {
    container.removeChildren();
    const {anchor = [0.5, 0.5], x = 0, y = 0} = newProps;
    container.anchor = anchor;
    container.x = x;
    container.y = y;

    const {col, skin, type} = newProps;
    const textures = [];
    for (let frame = 0; frame < numFrames; frame++) {
      textures.push(Texture.fromFrame(`${skin}_${type}_${col}_F${frame}.png`));
    }
    const animatedSprite =
        container.addChild(new extras.AnimatedSprite(textures));
    animatedSprite.animationSpeed = 0.25;
    animatedSprite.play();
  },
});

export const loadAssets = (callback, skin = '00') => {
  loader.add(`noteskin/${skin}/0.frames.json`)
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
};
