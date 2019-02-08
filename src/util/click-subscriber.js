export default class ClickSubscriber {
  static cancelTrigger;
  static subscribers = new Set();

  static subscribe(callback) {
    this.cancelTrigger = true;
    this.subscribers.add(callback);
  }

  static unsubscribe(callback) {
    this.cancelTrigger = true;
    this.subscribers.delete(callback);
  }

  static trigger(event) {
    this.cancelTrigger = false;
    for (const callback of this.subscribers) {
      callback(event);
      if (this.cancelTrigger) {
        break;
      }
    }
  }
}
