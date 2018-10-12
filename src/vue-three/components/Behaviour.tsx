import { Component, Mixins } from "vue-property-decorator";

import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";

@Component
export class Behaviour extends Mixins(
  ThreeComponent,
  ThreeSceneComponent,
  ThreeObjectComponent
) {
  public ready() {
    if ((this as any).update) {
      this.app().on("update", (this as any).update);
    }
  }

  public beforeDestroy() {
    console.log("before destroy behaviour");
    if ((this as any).update) {
      this.app().off("update", (this as any).update);
    }
  }
}
