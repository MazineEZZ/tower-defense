class WaveSystem {
  constructor(wavesInfo, enemyFactory, tileMap) {
    this.wavesInfo = wavesInfo;
    this.enemyFactory = enemyFactory;
    this.tileMap = tileMap;
    this.cellSize = this.tileMap.cellSize;

    // Own Prop
    this.currLvl = 0;

    this.timer = 0;
    this.zombieTime = 1;
  }

  spawn() {
    const path = this.tileMap.path;
    const spawnCell = path[0];
    this.enemyFactory.create("zombie", spawnCell.x, spawnCell.y, path);
  }
  update(dt) {
    this.timer += dt;

    while (this.timer >= this.zombieTime) {
      this.spawn();
      this.timer -= this.zombieTime;
    }
  }
}

export { WaveSystem };
