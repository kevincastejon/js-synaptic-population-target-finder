export default {
  alpha: {
    start: 0.45,
    end: 1,
  },
  scale: {
    start: 0.3,
    end: 0.01,
    minimumScaleMultiplier: 0.8,
  },
  color: {
    start: '#ff0000',
    end: '#330808',
  },
  speed: {
    start: 1000,
    end: 50,
    minimumSpeedMultiplier: 0.26,
  },
  acceleration: {
    x: 0,
    y: 6000,
  },
  maxSpeed: 0,
  startRotation: {
    min: 0,
    max: 360,
  },
  noRotation: false,
  rotationSpeed: {
    min: 100,
    max: 200,
  },
  lifetime: {
    min: 0.3,
    max: 0.5,
  },
  blendMode: 'normal',
  frequency: 0.2,
  emitterLifetime: -1,
  maxParticles: 500,
  pos: {
    x: 0,
    y: 0,
  },
  addAtBack: false,
  spawnType: 'burst',
  particlesPerWave: 250,
  particleSpacing: 0,
  angleStart: 0,
};
