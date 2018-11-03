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
      throw HandlerMapErrors.ALREADY_EXISTS;
    }
    this._data.set(name, handler);
    this.emitChange(name, handler);
  }
  public get(name: string): T | undefined {
    return this._data.get(name);
  }
  public dispose(name?: string) {
    if (!name) {
      this._data.forEach((item, key) => {
        this.emitChange(key, item);
        this.disposeHook(item);
      });
      this._data.clear();
      return;
    }

    const handler = this._data.get(name);
    if (handler) {
      this.emitChange(name, handler);
      this.disposeHook(handler);
    }
  }

  protected disposeHook(handler: T) {
    handler.dispose();
  }
  protected factoryHook(): T {
    return new this._ctor();
  }

  protected emitChange(name: string, handler?: T) {
    return this._onChange.listeners.map(fn => fn(name, handler));
  }
}
