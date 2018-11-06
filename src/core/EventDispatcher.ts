export class EventDispatcher<Func extends Function> {
  private _listeners: Func[] = [];

  public get listeners() {
    return this._listeners;
  }

  public on(fn: Func): void {
    this._listeners.push(fn);
  }
  public off(fn?: Func): void {
    if (!fn) {
      this._listeners = [];
      return;
    }
    const index = this._listeners.indexOf(fn);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
}
