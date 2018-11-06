import { HandlerMapErrors } from "./Errors";
import { EventDispatcher } from "./EventDispatcher";
import { Handle } from "./Handle";

export class HandleMap<T extends Handle> {
  protected _data = new Map<string, T>();
  protected _ctor: { new (...args: any[]): T };
  protected _onChange = new EventDispatcher<(name: string, item?: T) => void>();

  constructor(ctor: { new (...args: any[]): T }) {
    this._ctor = ctor;
  }

  public watch(fn: (name: string, item?: T) => void) {
    this._onChange.on(fn);
  }
  public unwatch(fn: (name: string, item?: T) => void) {
    this._onChange.off(fn);
  }

  public create(name: string): T {
    const handler = this.factoryHook();
    this.set(name, handler);
    return handler;
  }
  public set(name: string, handler: T): void {
    if (this._data.has(name)) {
      throw HandlerMapErrors.ALREADY_EXISTS(name);
    }
    this._data.set(name, handler);
    this.emitChange(name, handler);
  }
  public get(name: string): T | undefined {
    return this._data.get(name);
  }
  public dispose(name?: string): Promise<void> {
    if (!name) {
      const promises: Array<Promise<void>> = [];
      this._data.forEach((item, key) => {
        this.emitChange(key, undefined);
        const p = this.disposeHook(item);
        promises.push(p);
      });
      this._data.clear();
      return Promise.all(promises).then(() => Promise.resolve());
    }

    const handler = this._data.get(name);
    if (handler) {
      this.emitChange(name, undefined);
      const p = this.disposeHook(handler);
      this._data.delete(name);
      return p;
    }
    return Promise.resolve();
  }

  protected disposeHook(handler: T) {
    return handler.dispose();
  }
  protected factoryHook(): T {
    return new this._ctor();
  }

  protected emitChange(name: string, handler?: T) {
    return this._onChange.listeners.map(fn => fn(name, handler));
  }
}
