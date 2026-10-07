class Economy {
  constructor(events) {
    this.events = events;
    this.balance = 0;
  }
  spend(value) {
    if (this.balance < value) return false;
    this.balance -= value;
    this.events.emit("balanceUpdated", `${this.balance}`);
    return true;
  }
  add(value) {
    this.balance += value;
    this.events.emit("balanceUpdated", `${this.balance}`);
  }
}

export { Economy };
