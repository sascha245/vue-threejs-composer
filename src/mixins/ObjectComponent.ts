import { Camera, Object3D } from "three";
import { Component, Inject, Mixins } from "vue-property-decorator";

import { Provider, ProviderValue } from "../utils/provider";
import { SceneComponent } from "./SceneComponent";

export type ObjectType = Object3D | Camera;

@Component
export class ObjectComponent extends Mixins(SceneComponent) {
  @Inject({
    from: "object",
    default: Provider.defaultValue<ObjectType>()
  })
  private injectedObject!: ProviderValue<ObjectType>;

  protected get object() {
    return this.injectedObject.value;
  }
}
