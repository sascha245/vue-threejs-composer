import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";

import { ObjectComponent } from "../mixins";
import { Entity } from "./Entity";

@Component
export class Grid extends Mixins(Entity) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ type: Number, default: 10 })
  private size!: number;

  @Prop({ type: Number, default: 10 })
  private divisions!: number;

  protected async instantiate() {
    const grid = new THREE.GridHelper(this.size, this.divisions);
    grid.name = this.name;
    return grid;
  }
}
