import {PixiComponent} from '@inlet/react-pixi';
import {Container, extras, loader, Texture} from 'pixi.js'

export default PixiComponent('NoteSpecialComponent', {
  create: () => new Container(),
  applyProps: (container, oldProps, newProps) => {
    container.removeChildren();
    const {anchor = [0.5, 0.5], x = 0, y = 0} = newProps;
    container.anchor = anchor;
    container.x = x;
    container.y = y;

    const {type, subType, numFrames = 6} = newProps;
    const textures = [];
    for (let frame = 0; frame < numFrames; frame++) {
      textures.push(Texture.fromFrame(`${type}_${subType}_F${frame}.png`));
    }
    const animatedSprite =
        container.addChild(new extras.AnimatedSprite(textures));
    animatedSprite.animationSpeed = 0.25;
    animatedSprite.play();
  },
});

export const loadAssets = (callback) => {
  loader.add(`noteskin/DIVISION/arrow03.frames.json`)
      .add(`noteskin/DIVISION/rank_a.frames.json`)
      .add(`noteskin/DIVISION/rank_b.frames.json`)
      .add(`noteskin/DIVISION/rank_c.frames.json`)
      .add(`noteskin/ITEM/0.frames.json`)
      .add(`noteskin/ITEM/1.frames.json`)
      .add(`noteskin/ITEM/2.frames.json`)
      .add(`noteskin/ITEM/3.frames.json`)
      .add(`noteskin/ITEM/4.frames.json`)
      .add(`noteskin/ITEM/5.frames.json`)
      .load(callback);
};
