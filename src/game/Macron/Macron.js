import * as PIXI from 'pixi.js';
import Actor from '../Actor';
import Globals from '../../Globals';

export default class Macron extends Actor {
  constructor() {
    super(new PIXI.Sprite(Globals.RESOURCES.macron.texture),
      new PIXI.Sprite(Globals.RESOURCES.macronWounded.texture));
    this.widthack = this.sprite.width;
    this.heightack = this.sprite.height;
    this.moveAngle = 0;
    this.changeDirection();
  }

  changeDirection() {
    this.moveAngle = (Math.random() * (2 * Math.PI));
    const time = Math.random() * 1000;
    setTimeout(() => { this.changeDirection(); }, time);
  }
}
