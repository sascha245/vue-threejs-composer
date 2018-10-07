import { Scene } from "three";
import { Inject } from "vue-property-decorator";

import { ThreeComponent } from "./ThreeComponent";

export abstract class ThreeSceneComponent extends ThreeComponent {
  @Inject()
  protected scene!: () => Scene;
}
