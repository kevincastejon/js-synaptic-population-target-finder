import './index.css';
import * as PIXI from 'pixi.js';
import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game/Game';
import Globals from './Globals';
import App from './components/App';

const app = new PIXI.Application({
  width: Globals.WIDTH,
  height: Globals.HEIGHT,
  resolution: window.devicePixelRatio || 1,
});
let game = null;

function resizeHandler() {
  const canvasHolder = document.getElementById('canvasHolder');
  const offsetH = window.innerHeight - canvasHolder.offsetTop;
  const scaleFactor = Math.min(
    canvasHolder.offsetWidth / Globals.WIDTH,
    offsetH / Globals.HEIGHT,
  );
  const newWidth = Math.ceil(Globals.WIDTH * scaleFactor);
  const newHeight = Math.ceil(Globals.HEIGHT * scaleFactor);

  app.renderer.view.style.width = `${newWidth}px`;
  app.renderer.view.style.height = `${newHeight}px`;

  app.renderer.resize(newWidth, newHeight);
  game.scale.set(scaleFactor);
}

app.loader.add('macron', 'macron.png')
  .add('macronWounded', 'macronwounded.png')
  .add('yv', 'gj.png')
  .add('yvWounded', 'gjwounded.png')
  .load((loader, resources) => {
    Globals.RESOURCES = resources;
    game = new Game();
    const language = navigator.language || navigator.userLanguage;
    game.setLang(language === 'fr' ? 1 : 0);
    ReactDOM.render(<App
      game={game}
      init={(options) => {
        app.stage.addChild(game);
        game.init(options);
        resizeHandler();
        document.getElementById('canvasHolder').appendChild(app.view);
      }}
      startTrain={(iteration, progressCallback, finishCallback) => {
        game.startTrainNextGen(iteration, progressCallback, finishCallback);
      }}
      startGame={onGameEnd => game.startGameNextGen(onGameEnd)}
      changeSpeed={newSpeed => Game.setSpeed(newSpeed)}
      changeLang={(lang) => {
        game.setLang(lang);
        resizeHandler();
      }}

    />, document.getElementById('root'));
    app.view.id = 'gameCanvas';
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
  });
