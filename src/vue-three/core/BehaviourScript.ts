import { ThreeApplication } from "./ThreeApplication";

export abstract class BehaviourScript {
  public onInitialize(app: ThreeApplication, data: any) {}
  public onUpdate(deltaTime: number) {}
  public onDestroy() {}
}
