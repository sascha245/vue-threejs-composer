import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";

import { AssetTypes, GeometryType, MaterialType } from "../types";
import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";

@Component
export class Axes extends Mixins(
  ThreeComponent,
  ThreeSceneComponent,
  ThreeObjectComponent
) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ type: Number, default: 1 })
  private size!: number;

  @Provide("object")
  private provideObject = this.getObject;

  private m_axes!: THREE.AxesHelper;
  private m_created = false;

  public getObject(): THREE.Object3D {
    return this.m_axes;
  }

  public async created() {
    if (!this.scene && !this.object) {
      throw new Error(
        "Grid component can only be added as child to an object or mesh component"
      );
    }

    this.m_axes = new THREE.AxesHelper(this.size);
    this.m_axes.name = this.name;

    const parent = this.object ? this.object() : this.scene();
    parent.add(this.m_axes);

    this.m_created = true;
  }

  public beforeDestroy() {
    const parent = this.object ? this.object() : this.scene();
    parent.remove(this.m_axes);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
