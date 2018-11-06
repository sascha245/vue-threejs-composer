import { Scene } from "three";

import { BundleHandle } from "./BundleHandle";
import { CameraManager } from "./CameraManager";
import { Handle } from "./Handle";

export class SceneHandle extends Handle {
  private _bundle = new BundleHandle();
  private _cameras = new CameraManager();

  private _scene?: Scene;

  public get onLoadProgress() {
    return this._bundle.onLoadProgress;
  }
  public get cameras() {
    return this._cameras;
  }

  public set(scene?: Scene) {
    this._scene = scene;
  }
  public get() {
    return this._scene;
  }

  public registerDependency(bundle: BundleHandle) {
    return this._bundle.registerDependency(bundle);
  }
  public registerDependencies(bundles: BundleHandle[]) {
    return this._bundle.registerDependencies(bundles);
  }

  protected load() {
    return super.load().then(() => {
      return this._bundle.use();
    });
  }

  protected unload() {
    return super
      .unload()
      .then(() => {
        return this._cameras.dispose();
      })
      .then(() => {
        return this._bundle.unuse();
      });
  }
}
