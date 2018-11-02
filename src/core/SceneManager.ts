import { EventEmitter } from "events";
import { Scene } from "three";

export type SceneManagerHook = "change" | "activate" | "deactivate";

export class SceneManager {
  private _scenes = new Map<string, Scene>();
  private _hooks = new EventEmitter();
  private _uses = new Map<string, number>();

  public set(name: string, scene: Scene) {
    const res = this._scenes.get(name);
    if (res !== scene) {
      this._scenes.set(name, scene);
      this._hooks.emit("change", name, scene);
    }
  }

  public get(name: string) {
    return this._scenes.get(name);
  }

  public remove(name: string) {
    if (this._scenes.has(name)) {
      this._scenes.delete(name);
      this.emit("change", name, undefined);
    }
  }

  public on(type: SceneManagerHook, fn: (...args: any[]) => void) {
    this._hooks.on(type, fn);
  }
  public off(type: SceneManagerHook, fn: (...args: any[]) => void) {
    this._hooks.removeListener(type, fn);
  }

  public isUsed(name: string) {
    return this._uses.has(name);
  }
  public use(name: string) {
    const usages = this._uses.get(name) || 0;
    this._uses.set(name, usages + 1);
    if (!usages) {
      this.emit("activate", name);
    }
  }
  public unuse(name: string) {
    const usages = this._uses.get(name);
    if (!usages) {
      return;
    }
    if (usages <= 1) {
      this._uses.delete(name);
      this.emit("deactivate", name);
      return;
    }
    this._uses.set(name, usages - 1);
  }

  private emit(type: SceneManagerHook, ...args: any[]) {
    this._hooks.emit(type, ...args);
  }
}
