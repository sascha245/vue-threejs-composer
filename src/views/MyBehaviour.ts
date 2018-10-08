import { ThreeApplication } from "@/vue-three/core";
import { BehaviourScript } from "@/vue-three/core/BehaviourScript";

export class MyBehaviour extends BehaviourScript {
  public onInitialize(app: ThreeApplication, data: any) {
    console.log("my behaviour props", app, data);
  }

  public onUpdate() {
    // console.log("my behaviour update");
  }

  public onDestroy() {
    console.log("my behaviour destroy");
  }
}
