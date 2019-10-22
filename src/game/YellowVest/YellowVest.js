import * as PIXI from 'pixi.js';
import BrainedActor from '../BrainedActor';
import Globals from '../../Globals';
// import Checkpoint from '../Checkpoint';
//
// const rewardScale = 1;
// const rewards = [1, 2, 3, 4].map(r => r * rewardScale);
// const patterns = [
//   [Checkpoint.getTL(), Checkpoint.getTR()],
//   [Checkpoint.getBL(), Checkpoint.getBR()],
// ];

export default class YellowVest extends BrainedActor {
  constructor(brain) {
    super(brain, new PIXI.Sprite(Globals.RESOURCES.yv.texture),
      new PIXI.Sprite(Globals.RESOURCES.yvWounded.texture));
    this.sprite.alpha = 0.8;
    this.currentPattern = null;
    this.currentOrientation = null;
    this.patternCombo = 0;
    this.distanceToMacron = Number.MIN_VALUE;
    this.interactive = true;
    this.on('mouseover', () => {
      this.scoreText.visible = true;
      setTimeout(() => { this.scoreText.visible = false; }, 2000);
    });
  }

  autoEvaluate(macron) {
    const a = this.x - macron.x;
    const b = this.y - macron.y;
    this.distanceToMacron = Math.sqrt(a * a + b * b);
    if (this.distanceToMacron < Globals.NEAR) {
      this.brain.fitness += 2 * PIXI.Ticker.shared.deltaMS;
    } else if (this.distanceToMacron < Globals.AROUND) {
      this.brain.fitness += 1 * PIXI.Ticker.shared.deltaMS;
    } else if (this.distanceToMacron > Globals.AROUND) {
      // this.brain.fitness -= 1 * PIXI.Ticker.shared.deltaMS;
    }
    // const vOffset = macron.y > this.y ? 0 : 1;
    // const hOffset = macron.x > this.x ? 0 : 1;
    // const newPattern = patterns[vOffset][hOffset];
    // if (this.currentPattern !== null && newPattern !== this.currentPattern) {
    //   const newOrientation = newPattern.getPatternOrientation(this.currentPattern);
    //   if (newOrientation !== null && this.currentOrientation !== null) {
    //     if (newOrientation === this.currentOrientation) {
    //       this.brain.fitness += rewards[this.patternCombo];
    //       this.patternCombo += 1;
    //       if (this.patternCombo > 3) {
    //         this.patternCombo = 3;
    //       }
    //     } else {
    //       this.patternCombo = 0;
    //     }
    //   }
    //   this.currentOrientation = newOrientation;
    // }
    // this.currentPattern = newPattern;
  }
}
