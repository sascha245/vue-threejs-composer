import * as THREE from "three";
import { Component, Mixins, Prop } from "vue-property-decorator";

import { Entity } from "./Entity";

@Component
export class Axes extends Mixins(Entity) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ type: Number, default: 1 })
  private size!: number;

  protected async instantiate() {
    const axes = new THREE.AxesHelper(this.size);
    axes.name = this.name;
    return axes;
  }
}
