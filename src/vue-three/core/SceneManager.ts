import { Scene } from "three";

export class SceneManager {
  private _activeScene?: Scene;

  public get active() {
    return this._activeScene;
  }
  public set active(val) {
    this._activeScene = val;
  }
}
