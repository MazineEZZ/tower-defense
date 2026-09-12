import { gameSettings, inputBindings, tileSet } from "../data/settings.js";
import { EntityRegistry } from "../systems/entities.js";
import { CollisionSystem } from "../systems/collisions.js";
import { Inputs } from "../systems/inputs.js";
import { EventBus } from "../systems/events.js";
import { AudioSystem } from "../systems/audio.js";
import {
  UILayer,
  Label,
  ResourceBar,
  Checkbox,
  Slider,
  Button,
  Panel,
  ImageUI,
} from "../ui/ui.js";
import { TooltipManager } from "../ui/tooltip.js";
import { ToolBar } from "../ui/toolbar.js";
import { DebugOverlay } from "../systems/debug.js";
import { gameState } from "../states/gameState.js";
import { TileMap } from "../systems/tileMap.js";
import { AssetManager } from "../systems/assets.js";
import { PlacementGrid } from "../systems/placementGrid.js";
import { RegistrySystem } from "../systems/registry.js";
import { towerTypes } from "../data/data.js";
import { BuildSystem } from "../systems/building.js";
import { TowerFactory } from "../entities/towerFactory.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.collisions = new CollisionSystem();
    this.entities = new EntityRegistry();
    this.audio = new AudioSystem();
    this.inputs = new Inputs(inputBindings);
    this.events = new EventBus();
    this.tooltips = new TooltipManager();
    this.assetManager = new AssetManager();
    this.debugOverlay = new DebugOverlay(
      this.entities,
      this.collisions,
      this.inputs,
    );
    this.lastTime = null;
    this.animationFrameId = null;
    this.clientMouse = {
      position: { x: -10, y: -10 },
      lastClickPos: { x: -10, y: -10 },
    };

    // Game State
    gameState.setCurrentState(gameState.states.play);

    // Initial Setup
    this.canvas.width = gameSettings.width;
    this.canvas.height = gameSettings.height;

    this.audio.adjustVolume();
    this.inputs.setUpInputs();
    this.resizeCanvas();

    this.setUpEventListeners();
  }
  getScaledMousePos(e) {
    return {
      x: e.offsetX * (gameSettings.width / this.canvas.clientWidth),
      y: e.offsetY * (gameSettings.height / this.canvas.clientHeight),
    };
  }
  setUpEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.clientMouse.lastClickPos = this.getScaledMousePos(e);
      this.clientMouse.isDown = true;
    });
    this.canvas.addEventListener("mouseup", (e) => {
      this.clientMouse.isDown = false;
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this.clientMouse.position = this.getScaledMousePos(e);
    });
    window.addEventListener("keydown", (e) => {
      if (!this.inputs.isDown("pause_game")) return;
      gameState.handleEvent("togglePause", this);
    });
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.draw();
    });
  }
  resizeCanvas() {
    const margin = gameSettings.margin;
    const baseWidth = gameSettings.width;
    const baseHeight = gameSettings.height;
    const dpr = window.devicePixelRatio || 1;

    const availableWidth = window.innerWidth - margin * 2;
    const availableHeight = window.innerHeight - margin * 2;

    const scale = Math.max(
      1,
      Math.floor(
        Math.min(availableWidth / baseWidth, availableHeight / baseHeight),
      ),
    );

    this.canvas.style.width = baseWidth * scale + "px";
    this.canvas.style.height = baseHeight * scale + "px";
    this.canvas.style.margin = margin + "px";

    this.canvas.width = baseWidth * dpr;
    this.canvas.height = baseHeight * dpr;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = false;
  }
  loadPlayState() {
    this.playGroup = new RegistrySystem();

    // TileMap
    this.tileMap = new TileMap(
      gameSettings.cellSize,
      this.assetManager.getData("tilemap"),
      this.assetManager.getImage("tileset"),
    );
    this.placementGrid = new PlacementGrid(this.tileMap);

    this.towerFactory = new TowerFactory(towerTypes);
    this.buildFloor = new BuildSystem(
      this.tileMap,
      this.placementGrid,
      this.towerFactory,
    );

    this.events.on("towerPicked", (type) => {
      this.buildFloor.selectTower(type);
    });

    this.playGroup.register(this.tileMap);
    this.playGroup.register(this.placementGrid);
    this.playGroup.register(this.buildFloor);
    this.playGroup.register(this.towerFactory);
  }

  loadMenuUI() {
    this.menuUI = new UILayer();

    const title = new Label(gameSettings.width / 2, 200, {
      text: "Menu!",
      align: "center",
      baseline: "middle",
    });
    const startGameBtn = new Button(
      gameSettings.width / 2,
      500,
      200,
      50,
      4,
      this.events,
      "gameStarted",
      {
        btnBorderSize: "4px",
        btnBorderColor: "black",
      },
      {
        text: "Play Game",
      },
    );

    this.menuUI.register(title);
    this.menuUI.register(startGameBtn);

    this.events.on("gameStarted", (event) => {
      gameState.handleEvent(event, this);
    });
  }
  loadPauseUI() {
    this.pauseUI = new UILayer();

    const pauseText = new Label(
      gameSettings.width / 2,
      gameSettings.height / 2,
      {
        text: "Game Paused",
        align: "center",
        baseline: "middle",
      },
    );

    const menuBtnWidth = 200;
    const menuBtn = new Button(
      gameSettings.width / 2 + menuBtnWidth / 2,
      gameSettings.height / 2 + 100,
      menuBtnWidth,
      40,
      4,
      this.events,
      "gameMenu",
      {
        btnBorderColor: "black",
        btnBorderSize: "4px",
      },
      {
        text: "Quit to Menu",
      },
    );

    this.pauseUI.register(pauseText);
    this.pauseUI.register(menuBtn);

    this.events.on("gameMenu", (event) => {
      gameState.handleEvent(event, this);
    });
  }
  loadPlayUI() {
    this.playUI = new UILayer();
    // Some ui constants
    const cellSize = gameSettings.cellSize;
    const gameWidth = gameSettings.width;
    const gameHeight = gameSettings.height;
    const offset = 10;

    const btnWidth = cellSize;
    const btnHeight = cellSize / 2;
    const openToolbarBtn = new Button(
      cellSize - btnWidth / 2,
      9 * cellSize + cellSize / 2 - btnHeight / 2,
      btnWidth,
      btnHeight,
      4,
      this.events,
      "toggleToolbar",
      { btnBorderSize: 2, btnBorderColor: "black" },
      {
        text: "towers",
        fontClr: "white",
        fontSize: "18px",
      },
      "red",
      "green",
    );

    const toolbar = new ToolBar(
      offset,
      8 * cellSize + offset,
      gameWidth - offset * 2,
      2 * cellSize - offset * 2,
      4,
      this.events,
      towerTypes,
      "black",
    );
    toolbar.visible = false;

    this.events.on("toggleToolbar", () => {
      toolbar.visible = !toolbar.visible;
      openToolbarBtn.visible = !toolbar.visible;
    });

    this.playUI.register(openToolbarBtn);
    this.playUI.register(toolbar);
  }
  async init() {
    // Load assets
    await Promise.all([
      this.assetManager.loadImage("tileset", tileSet.imgSrc),
      this.assetManager.loadData("tilemap", tileSet.mapSrc),
      this.assetManager.loadImage("cursor", "sprites/cursor.png"),
      this.assetManager.loadImage("turret", "sprites/test.png"),
    ]);
    // this.towerTypes.map((t) => {
    //   t.img = this.assetManager.getImage(t.type);
    // });
    towerTypes[0].sprite = this.assetManager.getImage("turret");
    // Cursor
    this.cursor = new ImageUI(
      this.assetManager.getImage("cursor"),
      0,
      0,
      32,
      32,
      10,
    );

    // Entities States
    this.loadPlayState();

    // UI States
    this.loadPlayUI();
    this.loadPauseUI();
    this.loadMenuUI();
  }
  draw() {
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    gameState.currentState.draw(this);

    // debug
    this.debugOverlay.drawScreenStats(this.ctx);
    // Tooltip
    this.tooltips.draw(this.ctx);
    this.cursor.draw(this.ctx);
  }
  update(dt) {
    this.placementGrid.update(dt, this.clientMouse);
    gameState.currentState.update(dt, this);

    // Tooltip
    this.tooltips.update(dt, this.clientMouse, gameState.currentState);
    // Debug
    this.debugOverlay.update(dt, this.clientMouse);
    // Reset Mouse Click Pos
    this.clientMouse.lastClickPos = { x: -10, y: -10 };
    this.cursor.position = this.clientMouse.position;
  }
  gameLoop() {
    const loop = (timestamp) => {
      if (this.lastTime === null) this.lastTime = timestamp;
      const dt = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      this.update(dt);
      this.draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }
  async start() {
    await this.init();
    this.gameLoop();
  }
  stop() {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    this.lastTime = null;
  }
  restart() {
    this.stop();
    this.score = 0;
    this.entities = new EntityRegistry();
    this.collisions = new CollisionSystem();
    this.events = new EventBus();
    this.start();
  }
}

export { Game };
