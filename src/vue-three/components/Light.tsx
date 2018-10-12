import * as THREE from "three";
import { Component, Mixins, Prop, Provide, Watch } from "vue-property-decorator";

import { LightFactory } from "../types";
import { ThreeComponent, ThreeSceneComponent } from "./base";

@Component
export class Light extends Mixins(ThreeComponent, ThreeSceneComponent) {
  @Prop({ required: true })
  private name!: string;

  @Prop({ default: false, type: Boolean })
  private castShadow!: boolean;

  @Prop({ required: true, type: Function })
  public factory!: LightFactory;

  @Provide("object")
  public provideObject = this.object;

  private m_light!: THREE.Light;
  private m_created = false;

  @Watch("castShadow")
  private onChangeCastShadow() {
    this.m_light.castShadow = this.castShadow;
  }

  public object(): THREE.Object3D {
    return this.m_light;
  }

  public async created() {
    this.m_light = await this.factory();
    this.onChangeCastShadow();
    this.scene().add(this.m_light);
    this.m_created = true;
  }

  public beforeDestroy() {
    console.log("light beforeDestroy");
    if (this.scene()) {
      console.log("light remove from scene");
      this.scene().remove(this.m_light);
    }
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return (
      <div className="light">
        <span>Light {this.name}</span>
        <ul>{this.$slots.default}</ul>
      </div>
    );
  }
}
