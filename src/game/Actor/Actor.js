import * as PIXI from 'pixi.js';

export default class Actor extends PIXI.Container {
  constructor(sprite, woundedSprite = null) {
    super();
    this.sprite = sprite;
    this.sprite.x = -this.sprite.width / 2;
    this.sprite.y = -this.sprite.height / 2;
    this.woundedSprite = woundedSprite;
    if (this.woundedSprite) {
      this.woundedSprite.x = -this.woundedSprite.width / 2;
      this.woundedSprite.y = -this.woundedSprite.height / 2;
    }
    this.scoreText = new PIXI.Text('', {
      fill: 'white',
      fontFamily: 'Arial Black',
      fontSize: 35,
      strokeThickness: 4,
    });
    this.setScore(0);
    this.circle = new PIXI.Graphics();
    this.circle.beginFill(0x00FF00, 0.3);
    this.circle.drawCircle(0, 0, this.sprite.width / 2);
    this.circle.visible = false;
    this.addChild(this.circle);
    this.addChild(this.sprite);
    this.addChild(this.woundedSprite);
    this.woundedSprite.visible = false;
    this.addChild(this.scoreText);
    this.scoreText.visible = false;
  }

  hurt() {
    if (!this.woundedSprite) {
      return;
    }
    this.sprite.visible = false;
    this.woundedSprite.visible = true;
  }

  heal() {
    if (!this.woundedSprite) {
      return;
    }
    this.sprite.visible = true;
    this.woundedSprite.visible = false;
  }

  highlight(bool) {
    this.circle.visible = bool;
  }

  setScore(score) {
    this.scoreText.text = Number.parseInt(score, 10).toString();
    this.scoreText.x = -this.scoreText.width / 2;
    this.scoreText.y = -this.scoreText.height / 2;
  }
}
