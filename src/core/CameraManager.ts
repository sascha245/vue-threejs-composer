import { Camera } from "three";

export class CameraManager {
  private _mainCamera?: Camera;

  public get main() {
    return this._mainCamera;
  }
  public set main(val) {
    this._mainCamera = val;
  }
}
