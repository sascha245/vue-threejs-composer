import { Application } from "./Application";
import { HandleMap } from "./HandleMap";
import { SceneHandle } from "./SceneHandle";

export class SceneManager extends HandleMap<SceneHandle> {
  constructor(private app: Application) {
    super(SceneHandle);
  }
}
