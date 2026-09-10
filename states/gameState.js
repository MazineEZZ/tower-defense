import { State, StateManager } from "../systems/states.js";

// GAME STATE
const pausedState = new State(
  [
    {
      event: "togglePause",
      state: "play",
    },
    {
      event: "gameMenu",
      state: "menu",
    },
  ],
  {
    onEnter: (game) => {
      game.events.emit("gamePaused");
    },
    update: (dt, game) => {
      game.pauseUI.update(dt, game.clientMouse);
    },
    draw: (game) => {
      game.pauseUI.draw(game.ctx);
    },
  },
);
const menuState = new State(
  [
    {
      event: "gameStarted",
      state: "play",
    },
  ],
  {
    update: (dt, game) => {
      game.menuUI.update(dt, game.clientMouse);
    },
    draw: (game) => {
      game.menuUI.draw(game.ctx);
    },
  },
);
const playState = new State(
  [
    {
      event: "togglePause",
      state: "paused",
    },
  ],
  {
    onEnter: (game) => game.events.emit("gameUnpaused"),
    update: (dt, game) => {
      // Entities
      game.playGroup.update(dt, game.clientMouse);
      // UI
      game.playUI.update(dt, game.clientMouse);
    },
    draw: (game) => {
      // Entities
      game.playGroup.draw(game.ctx);
      // Debug
      game.debugOverlay.drawHitboxes(game.ctx);
      game.debugOverlay.drawGrid(game.ctx);
      // UI
      game.playUI.draw(game.ctx);
    },
  },
);

const gameState = new StateManager({
  paused: pausedState,
  menu: menuState,
  play: playState,
});

export { gameState };
