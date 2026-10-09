class GameController {
  constructor(hearts, events) {
    this.events = events;
    this.hearts = 10;
  }
  subHearts(value) {
    this.hearts -= value * 3;
    if (this.hearts < 0) this.events.emit("gameOver");
  }
}

export { GameController };
