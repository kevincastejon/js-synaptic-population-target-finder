import Actor from '../Actor';

export default class BrainedActor extends Actor {
  constructor(brain, sprite, woundedSprite = null) {
    super(sprite, woundedSprite);
    this.brain = brain;
  }

  get fitness() {
    return this.brain.fitness;
  }

  set fitness(val) {
    this.brain.fitness = val;
  }

  activate(inputs) {
    return this.brain.activate(inputs);
  }

  propagate(target, learningRate = 0.3) {
    return this.brain.propagate(learningRate, target);
  }
}
