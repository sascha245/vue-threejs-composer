import * as THREE from "three";
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";

import { ThreeApplication } from "../core";
import { LightFactory } from "../types";

@Component
export class Light extends Vue {
  @Inject()
  protected app!: () => ThreeApplication;

  @Inject()
  protected scene!: () => THREE.Scene;

  @Prop({ required: true })
  private name!: string;

  @Prop({ default: false, type: Boolean })
  private castShadow!: boolean;

  @Prop({
    default() {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  })
  private position!: { x: number; y: number; z: number };

  @Prop({
    default() {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  })
  private rotation!: { x: number; y: number; z: number };

  @Prop({ required: true, type: Function })
  public factory!: LightFactory;

  private m_light!: THREE.Light;

  @Watch("position", { deep: true })
  private onChangePosition() {
    this.m_light.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
  }

  @Watch("rotation", { deep: true })
  private onChangeRotation() {
    const rad = THREE.Math.degToRad;
    this.m_light.rotation.set(
      rad(this.rotation.x),
      rad(this.rotation.y),
      rad(this.rotation.z)
    );
  }

  @Watch("castShadow")
  private onChangeCastShadow() {
    this.m_light.castShadow = this.castShadow;
  }

  public async mounted() {
    this.m_light = await this.factory();

    console.log("light mounted", this.name, this.m_light);
    this.onChangePosition();
    this.onChangeRotation();
    this.onChangeCastShadow();
    this.scene().add(this.m_light);
  }

  public beforeDestroy() {
    console.log("light beforeDestroy");
    if (this.scene()) {
      console.log("light remove from scene");
      this.scene().remove(this.m_light);
    }
  }

  public render(h: any) {
    return <div className="light">Light {this.name}</div>;
  }
}
