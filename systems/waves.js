import { gameSettings } from "../data/settings.js";

class WaveSystem {
  constructor(wavesInfo, enemyFactory) {
    this.wavesInfo = wavesInfo;
    this.enemyFactory = enemyFactory;
    this.cellSize = gameSettings.cellSize; // Own Prop

    this.currLvl = 0;

    this.timer = 0;
    this.spawnInterval = 1;
    this.spawned = 0;
    this.currWave = 0;
    this.isOver = false;
    this.isFinished = false;
  }
  spawn() {
    this.enemyFactory.create(this.wavesInfo[this.currWave][this.spawned]);
  }
  update(dt) {
    if (this.isFinished || this.isOver) return;
    this.timer += dt;

    while (this.timer >= this.spawnInterval) {
      this.timer -= this.spawnInterval;
      if (this.spawned < this.wavesInfo[this.currWave].length) {
        this.spawn();
        this.spawned++;
      }
    }
    if (this.spawned >= this.wavesInfo[this.currWave].length) {
      this.currWave++;
      this.spawned = 0;
      this.isFinished = true;
      this.isOver = this.currWave >= this.wavesInfo.length;
    }
  }
}

export { WaveSystem };
