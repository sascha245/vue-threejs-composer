import { EventEmitter } from "events";
import { Camera } from "three";

export type CameraManagerHook = "change";

export class CameraManager {
  private _mainCamera?: Camera;

  private _cameras: Map<string, Camera> = new Map();
  private _hooks = new EventEmitter();
  private _uses = new Map<string, number>();

  public set(name: string, camera: Camera) {
    const res = this._cameras.get(name);
    if (res !== camera) {
      this._cameras.set(name, camera);
      this._hooks.emit("change", name, camera);
    }
  }

  public get(name: string) {
    return this._cameras.get(name);
  }

  public remove(name: string) {
    this._cameras.delete(name);
    this._hooks.emit("change", name, undefined);
  }

  public on(type: CameraManagerHook, fn: (...args: any[]) => void) {
    this._hooks.on(type, fn);
  }
  public off(type: CameraManagerHook, fn: (...args: any[]) => void) {
    this._hooks.removeListener(type, fn);
  }

  public use(name: string) {
    const usages = this._uses.get(name) || 0;
    this._uses.set(name, usages + 1);
  }
  public unuse(name: string) {
    const usages = this._uses.get(name) || 0;
    if (usages <= 1) {
      this._uses.delete(name);
      return;
    }
    this._uses.set(name, usages - 1);
  }

  public get main() {
    return this._mainCamera;
  }
  public set main(val) {
    this._mainCamera = val;
  }
}
