import { Scene } from "three";

import { BundleHandle } from "./BundleHandle";
import { Handle } from "./Handle";

export class SceneHandle extends Handle {
  private _bundle = new BundleHandle();

  private _scene?: Scene;

  public get onLoadProgress() {
    return this._bundle.onLoadProgress;
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
    console.log("load scene");
    const p = super.load();
    return p.then(() => {
      return this._bundle.use();
    });
  }

  protected deactivate() {
    return super.deactivate().then(() => {
      console.log("deactivate scene");
    });
  }

  protected unload() {
    const p = super.load();
    return p.then(() => {
      console.log("unload scene");
      return this._bundle.unuse();
    });
  }
}
