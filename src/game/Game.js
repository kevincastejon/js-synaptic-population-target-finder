import * as PIXI from 'pixi.js';
import YellowVest from './YellowVest';
import Macron from './Macron';
import Globals from '../Globals';
import Population from './Population';
import Lang from '../lang/Lang';
import bloodEmitter from '../bloodParticlesSettings';

const particles = require('pixi-particles');

export default class Game extends PIXI.Container {
  constructor() {
    super();
    this.yellowVests = [];
    this.yvSpeed = 0.2;
    this.chrono = 0;
    this.countDown = 0;
    this.particles = new PIXI.Container();
    this.particles.visible = false;
    this.macron = new Macron();
    this.macron.interactive = true;
    this.macron.on('mouseover', () => {
      this.nearCircle.visible = true;
      this.aroundCircle.visible = true;
      setTimeout(() => {
        this.nearCircle.visible = false;
        this.aroundCircle.visible = false;
      }, 2000);
    });
    this.lang = 0;
    this.emitter = new particles.Emitter(
      this.particles, [PIXI.Texture.from('./blood.png')], bloodEmitter,
    );
    this.emitter.emit = true;
    this.txtGeneration = new PIXI.Text(`${Lang.act[this.lang]} : 0`, { fontFamily: 'Arial', fontSize: 30, fill: 0xffffff });
    this.txtCountDown = new PIXI.Text(`${Lang.dispersal[this.lang]} : 0`, { fontFamily: 'Arial', fontSize: 30, fill: 0xffffff });
    this.txtCountDown.y = 50;
    this.txtExtinction = new PIXI.Text('Extinctions : 0', { fontFamily: 'Arial', fontSize: 30, fill: 0xffffff });
    this.txtExtinction.y = 100;
    this.addChild(this.txtGeneration);
    this.addChild(this.txtCountDown);
    this.addChild(this.txtExtinction);
    this.endGameCallback = null;
    this.population = null;
    this.particleHackTimeout = null;
    this.aroundCircle = new PIXI.Graphics();
    this.aroundCircle.beginFill(0xc66b01, 0.3);
    this.aroundCircle.drawCircle(0, 0, Globals.AROUND);
    this.aroundCircle.visible = false;
    this.nearCircle = new PIXI.Graphics();
    this.nearCircle.beginFill(0xFF0000, 0.3);
    this.nearCircle.drawCircle(0, 0, Globals.NEAR);
    this.nearCircle.visible = false;
    this.debugControl = false;
  }

  init(options = {}) {
    const {
      yellowVestNumber = 10,
      leaders = 4,
      hiddenLayers = [8],
      trainedPopul = null,
      chrono = 8,
      mutationRate = 0.2,
    } = options;
    this.countDown = chrono;
    this.chrono = chrono * 1000;
    if (trainedPopul) {
      this.txtGeneration.text = `${Lang.act[this.lang]} : ${this.population.generation}`;
    }
    this.population = new Population({
      demography: yellowVestNumber,
      eliteDemography: leaders,
      extinction: 0,
      inputs: 2,
      outputs: 2,
      hiddenLayers,
      mutateRate: mutationRate,
    });
    this.population.create(trainedPopul);
    if (this.debugControl) {
      window.addEventListener('keydown', (e) => {
        const { key } = e;
        if (key === 'q') {
          this.debugLeft = true;
        }
        if (key === 'd') {
          this.debugRight = true;
        }
        if (key === 'z') {
          this.debugUp = true;
        }
        if (key === 's') {
          this.debugDown = true;
        }
      });
      window.addEventListener('keyup', (e) => {
        const { key } = e;
        if (key === 'q') {
          this.debugLeft = false;
        }
        if (key === 'd') {
          this.debugRight = false;
        }
        if (key === 'z') {
          this.debugUp = false;
        }
        if (key === 's') {
          this.debugDown = false;
        }
      });
    }
  }

  setLang(lang) {
    this.lang = lang;
    this.txtGeneration.text = `${Lang.act[this.lang]} : ${this.population ? this.population.generation : '0'}`;
    this.txtCountDown.text = `${Lang.dispersal[this.lang]} : ${parseInt(this.countDown / 1000, 10)}`;
  }

  static setSpeed(speed) {
    PIXI.Ticker.shared.speed = speed;
  }

  async startTrainNextGen(iteration, progressCallback, finishCallback) {
    const max = iteration;
    this.removeChild(this.macron);
    this.removeChild(this.aroundCircle);
    this.removeChild(this.nearCircle);
    for (let k = 0; k < max; k += 1) {
      this.yellowVests.forEach(r => this.removeChild(r));
      this.startNextGen();
      while (this.countDown > 0) {
        this.update();
      }
      this.population.evolve();
      this.txtExtinction.text = `Extinctions : ${this.population.extinctions}`;

      progressCallback(k);
      await Game.wait(0);
    }
    const pop = this.population.brains.map(g => g.toJSON());
    finishCallback({ generation: this.population.generation, pop });
  }

  startGameNextGen(onEndGame) {
    this.endGameCallback = onEndGame;
    this.addChild(this.aroundCircle);
    this.addChild(this.nearCircle);
    this.addChild(this.macron);
    this.addChild(this.particles);
    this.particles.visible = false;
    this.yellowVests.forEach(r => this.removeChild(r));
    this.startNextGen();
    this.yellowVests.forEach((r) => { r.heal(); this.addChild(r); });
    this.addChild(this.txtGeneration);
    this.addChild(this.txtCountDown);
    this.addChild(this.txtExtinction);
    PIXI.Ticker.shared.add(this.onTick, this);
  }

  onTick() {
    this.emitter.update(PIXI.Ticker.shared.elapsedMS / 1000);
    this.update(true);
    this.txtCountDown.text = `${Lang.dispersal[this.lang]} : ${parseInt(this.countDown / 1000, 10)}`;
    if (this.countDown <= 0) {
      PIXI.Ticker.shared.remove(this.onTick, this);
      const pop = this.population.brains.map(g => g.toJSON());
      this.population.evolve();
      this.txtExtinction.text = `Extinctions : ${this.population.extinctions}`;
      this.endGameCallback({ generation: this.population.generation, pop });
    }
  }

  startNextGen() {
    this.yellowVests = [];
    this.countDown = this.chrono;
    this.txtGeneration.text = `${Lang.act[this.lang]} : ${this.population.generation}`;
    this.macron.heal();
    this.macron.x = Math.random()
    * (Globals.WIDTH - this.macron.width * 4) + this.macron.width * 2;
    this.macron.y = Math.random()
    * (Globals.HEIGHT - this.macron.height * 4) + this.macron.height * 2;
    this.particles.x = this.macron.x;
    this.particles.y = this.macron.y;
    for (let i = 0; i < this.population.brains.length; i += 1) {
      const yv = new YellowVest(this.population.brains[i]);
      const x = Math.random() * (Globals.WIDTH);
      const y = Math.random() * (Globals.HEIGHT);
      yv.x = x;
      yv.y = y;
      this.yellowVests.push(yv);
    }
  }

  update(render = false) {
    this.yellowVests.forEach((yv) => {
      if (render) {
        yv.highlight(false);
      }
      this.activateYellowVest(yv, render);
    });
    if (render) {
      this.yellowVests
        .concat()
        .sort((a, b) => a.fitness < b.fitness)
        .splice(0, this.population.eliteDemography)
        .forEach(yv => yv.highlight(true));
    }
    const borderConstraint = 100;
    const speed = Math.random() * (this.yvSpeed * 2) * PIXI.Ticker.shared.deltaMS;
    let xstep = speed * Math.cos(this.macron.moveAngle);
    let ystep = speed * Math.sin(this.macron.moveAngle);

    if ((this.macron.moveAngle > Math.PI / 2 || this.macron.moveAngle < Math.PI * 1.5)
     && this.macron.x + xstep < borderConstraint) {
      this.macron.moveAngle = Game.inverseAngle(this.macron.moveAngle);
      xstep = speed * Math.cos(this.macron.moveAngle);
    } else if ((this.macron.moveAngle < Math.PI / 2 || this.macron.moveAngle > Math.PI * 1.5)
     && this.macron.x + xstep > Globals.WIDTH - borderConstraint) {
      this.macron.moveAngle = Game.inverseAngle(this.macron.moveAngle);
      xstep = speed * Math.cos(this.macron.moveAngle);
    } else if (this.macron.moveAngle > Math.PI
      && this.macron.y + ystep < borderConstraint) {
      this.macron.moveAngle = Game.inverseAngle(this.macron.moveAngle);
      ystep = speed * Math.sin(this.macron.moveAngle);
    } else if (this.macron.moveAngle < Math.PI
      && this.macron.y + ystep > Globals.HEIGHT - borderConstraint) {
      this.macron.moveAngle = Game.inverseAngle(this.macron.moveAngle);
      ystep = speed * Math.sin(this.macron.moveAngle);
    }

    this.macron.x += xstep;
    this.macron.y += ystep;

    if (render) {
      this.particles.x = this.macron.x;
      this.particles.y = this.macron.y;
      this.aroundCircle.x = this.macron.x;
      this.aroundCircle.y = this.macron.y;
      this.nearCircle.x = this.macron.x;
      this.nearCircle.y = this.macron.y;
    }
    this.countDown -= PIXI.Ticker.shared.deltaMS;
    this.countDown = this.countDown < 0 ? 0 : this.countDown;
  }

  activateYellowVest(yellow, render = false) {
    const yv = yellow;
    const inputs = [yv.x - this.macron.x,
      yv.y - this.macron.y];
    const output = yv.activate(inputs);
    // yv.propagate([rangedAngle], 0.1);
    const left = this.debugControl ? this.debugLeft : output[0] < 0.5;
    const right = this.debugControl ? this.debugRight : output[0] > 0.5;
    const up = this.debugControl ? this.debugUp : output[1] < 0.5;
    const down = this.debugControl ? this.debugDown : output[1] > 0.5;
    const step = this.yvSpeed * PIXI.Ticker.shared.deltaMS;

    if (left && yv.x - step >= 0) {
      yv.x -= step;
    }
    if (right && yv.x + step <= Globals.WIDTH) {
      yv.x += step;
    }
    if (up && yv.y - step >= 0) {
      yv.y -= step;
    }
    if (down && yv.y + step <= Globals.HEIGHT) {
      yv.y += step;
    }
    yv.autoEvaluate(this.macron);
    if (render) {
      yv.setScore(yv.fitness);
    }
    if (render && yv.distanceToMacron < Globals.NEAR) {
      this.macron.hurt();
      this.particles.visible = true;
      if (this.particleHackTimeout) {
        clearTimeout(this.particleHackTimeout);
      }
      this.particleHackTimeout = setTimeout(() => {
        this.particles.visible = false;
      }, 200);
    }
  }

  static inverseAngle(pAngle) {
    let angle = pAngle;
    if (angle < Math.PI) {
      angle += Math.PI;
    } else {
      angle -= Math.PI;
    }
    return angle;
  }

  static wait(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}
