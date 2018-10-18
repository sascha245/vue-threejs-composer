import * as THREE from "three";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { ThreeObjectComponent } from "../base";

@Component
export class Rotation extends Mixins(ThreeObjectComponent) {
  @Prop({
    required: true,
    type: Object
  })
  private value!: { x: number; y: number; z: number };

  @Prop({
    default: false,
    type: Boolean
  })
  private rad!: boolean;

  @Watch("value", { deep: true })
  private onChange() {
    if (this.rad) {
      this.object!().rotation.set(this.value.x, this.value.y, this.value.z);
    } else {
      const rad = THREE.Math.degToRad;
      this.object!().rotation.set(
        rad(this.value.x),
        rad(this.value.y),
        rad(this.value.z)
      );
    }
  }

  public created() {
    if (!this.object) {
      throw new Error(
        "Rotation property can only be added as child to an object component"
      );
    }
    this.onChange();
  }

  public render(h: any) {
    return <div />;
  }
}
