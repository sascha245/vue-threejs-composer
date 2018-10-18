import * as THREE from "three";
import { Component, Mixins, Prop, Provide, Watch } from "vue-property-decorator";

import { LightFactory } from "../types";
import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";

@Component
export class Light extends Mixins(
  ThreeComponent,
  ThreeSceneComponent,
  ThreeObjectComponent
) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ required: true, type: Function })
  public factory!: LightFactory;

  @Provide("object")
  public provideObject = this.getObject;

  private m_light!: THREE.Light;
  private m_created = false;

  public getObject(): THREE.Object3D {
    return this.m_light;
  }

  public async created() {
    if (!this.scene && !this.object) {
      throw new Error(
        "Light component can only be added as child to an object or scene component"
      );
    }

    this.m_light = await this.factory();
    this.m_light.name = this.name;
    const parent = this.object ? this.object() : this.scene();
    parent.add(this.m_light);

    this.m_created = true;
  }

  public beforeDestroy() {
    const parent = this.object ? this.object() : this.scene();
    parent.remove(this.m_light);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return <div>{this.$slots.default}</div>;
  }
}
