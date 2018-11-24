import { EventDispatcher } from "./EventDispatcher";

export class Handle {
  private _queue = Promise.resolve();
  private _usages = 0;

  private _onLoad = new EventDispatcher<() => Promise<void>>();
  private _onActivate = new EventDispatcher<() => Promise<void>>();
  private _onUnload = new EventDispatcher<() => Promise<void>>();
  private _onDeactivate = new EventDispatcher<() => Promise<void>>();

  private _unloadTimeout = 0;
  private _unloadTimeoutHandle: any | null = null;

  public get queue() {
    return this._queue;
  }
  public get onLoad() {
    return this._onLoad;
  }
  public get onActivate() {
    return this._onActivate;
  }
  public get onUnload() {
    return this._onUnload;
  }
  public get onDeactivate() {
    return this._onDeactivate;
  }
  public get unloadTimeout() {
    return this._unloadTimeout;
  }
  public set unloadTimeout(val: number) {
    this._unloadTimeout = val;
  }

  public use(): Promise<void> {
    if (this._usages++ === 0) {
      if (this._unloadTimeoutHandle) {
        clearTimeout(this._unloadTimeoutHandle);
        this._unloadTimeoutHandle = null;
      }
      this._queue = this.load();
      this._queue = this.activate();
    }
    return this._queue;
  }
  public unuse(): Promise<void> {
    if (this._usages > 0 && --this._usages === 0) {
      const updateQueue = () => {
        this._queue = this.unload();
        this._queue = this.deactivate();
      };

      // if there is a timeout, we wait until the timeout is over before unloading / disposing the bundle
      if (this._unloadTimeout) {
        this._unloadTimeoutHandle = setTimeout(
          updateQueue,
          this._unloadTimeout
        );
      }
      // else we dispose directly
      else {
        updateQueue();
      }
    }
    return this._queue;
  }

  public dispose(): Promise<void> {
    if (this._usages > 0) {
      this._usages = 0;
      this._queue = this.unload();
      this._queue = this.deactivate();
    }
    return this._queue;
  }

  protected load(): Promise<void> {
    return this._queue.then(() => {
      const p = this._onLoad.listeners.map(fn => fn());
      return Promise.all(p).then(() => Promise.resolve());
    });
  }
  protected activate(): Promise<void> {
    return this._queue.then(() => {
      const p = this._onActivate.listeners.map(fn => fn());
      return Promise.all(p).then(() => Promise.resolve());
    });
  }
  protected unload(): Promise<void> {
    return this._queue.then(() => {
      const p = this._onUnload.listeners.map(fn => fn());
      return Promise.all(p).then(() => Promise.resolve());
    });
  }
  protected deactivate(): Promise<void> {
    return this._queue.then(() => {
      const p = this._onDeactivate.listeners.map(fn => fn());
      return Promise.all(p).then(() => Promise.resolve());
    });
  }

  protected handleUnload() {}
}
