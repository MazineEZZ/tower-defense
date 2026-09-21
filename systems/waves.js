import { gameSettings } from "../data/settings.js";

class WaveSystem {
  constructor(wavesInfo, enemyFactory) {
    this.wavesInfo = wavesInfo;
    this.enemyFactory = enemyFactory;
    this.cellSize = gameSettings.cellSize;

    // Own Prop
    this.currLvl = 0;

    this.timer = 0;
    this.zombieTime = 1;
    this.spawned = 0;
  }

  spawn() {
    this.enemyFactory.create("zombie");
  }
  update(dt) {
    this.timer += dt;

    while (this.timer >= this.zombieTime) {
      this.timer -= this.zombieTime;
      if (this.spawned < 10) {
        this.spawn();
        this.spawned++;
      }
    }
  }
}

export { WaveSystem };
