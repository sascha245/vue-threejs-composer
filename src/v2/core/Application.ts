import { AssetManager } from "./AssetManager";
import { CameraManager } from "./CameraManager";
import { EventDispatcher } from "./EventDispatcher";
import { Loader } from "./Loader";
import { RendererManager } from "./RendererManager";
import { SceneManager } from "./SceneManager";

export class Application {
  private _scenes = new SceneManager(this);
  private _cameras = new CameraManager(this);
  private _renderers = new RendererManager(this);
  private _assets = new AssetManager(this);
  private _loader = new Loader();

  private _lastUpdate = 0;
  private _animationFrame?: number;

  private _onBeforeUpdate = new EventDispatcher<() => void>();
  private _onUpdate = new EventDispatcher<(dt: number) => void>();
  private _onAfterUpdate = new EventDispatcher<() => void>();

  public get loader() {
    return this._loader;
  }
  public get scenes() {
    return this._scenes;
  }
  public get cameras() {
    return this._cameras;
  }
  public get renderers() {
    return this._renderers;
  }
  public get assets() {
    return this._assets;
  }

  public get onBeforeUpdate() {
    return this._onBeforeUpdate;
  }
  public get onUpdate() {
    return this._onUpdate;
  }
  public get onAfterUpdate() {
    return this._onAfterUpdate;
  }

  public activate() {
    if (!this._animationFrame) {
      this._lastUpdate = Date.now();
      this.update();
    }
  }

  public deactivate() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = undefined;
    }
  }

  public dispose() {}

  private update = () => {
    const now = Date.now();
    const deltaTime = (now - this._lastUpdate) * 0.001;
    this._animationFrame = requestAnimationFrame(this.update);
    this._lastUpdate = now;

    this._onBeforeUpdate.listeners.forEach(fn => fn());
    this._onUpdate.listeners.forEach(fn => fn(deltaTime));
    this._onAfterUpdate.listeners.forEach(fn => fn());

    this.renderers.render();
  };
}
