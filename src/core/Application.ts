import { EventEmitter } from "events";

import { AssetManager } from "../core/AssetManager";
import { CameraManager } from "../core/CameraManager";
import { InputManager } from "../core/InputManager";
import { SceneManager } from "../core/SceneManager";
import { RendererManager } from "./RendererManager";

export type ApplicationHook =
  | "update"
  | "beforeRender"
  | "afterRender"
  | "ready";

export class Application {
  public readonly sceneManager = new SceneManager();
  public readonly cameraManager = new CameraManager();
  public readonly renderers = new RendererManager(this);
  public readonly assets = new AssetManager();
  public readonly inputs = new InputManager();

  private _disposed = false;
  public get isDisposed() {
    return this._disposed;
  }

  private _hooks = new EventEmitter();

  constructor() {
    this._hooks.setMaxListeners(Infinity);
  }

  public on(type: ApplicationHook, fn: (...args: any[]) => void) {
    this._hooks.on(type, fn);
  }
  public off(type: ApplicationHook, fn: (...args: any[]) => void) {
    this._hooks.removeListener(type, fn);
  }

  public ready() {
    this._hooks.emit("ready");
  }

  public update(deltaTime: number) {
    this.inputs.update();
    this._hooks.emit("update", deltaTime);
    this._hooks.emit("beforeRender");
    this.renderers.render();
    this._hooks.emit("afterRender");
  }

  public dispose() {
    this.inputs.dispose();
    this._disposed = true;
  }
}
