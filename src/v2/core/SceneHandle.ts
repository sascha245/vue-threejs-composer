import { Scene } from "three";

import { BundleHandle } from "./BundleHandle";
import { Handle } from "./Handle";

export class SceneHandle extends Handle {
  private _bundle = new BundleHandle();

  private _scene?: Scene;

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
    const p = super.load();
    return p.then(() => {
      return this._bundle.use();
    });
  }

  protected unload() {
    const p = super.load();
    return p.then(() => {
      return this._bundle.unuse();
    });
  }
}
