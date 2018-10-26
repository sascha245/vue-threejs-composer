import * as THREE from "three";
import { Component, Mixins, Prop, Provide, Watch } from "vue-property-decorator";

import { ThreeComponent, ThreeSceneComponent } from "./base";

@Component
export class Fog extends Mixins(ThreeComponent, ThreeSceneComponent) {
  @Prop({ type: Number, default: 0xffffff })
  public color!: number;

  @Prop({ type: Number, default: 1 })
  public near!: number;

  @Prop({ type: Number, default: 1000 })
  public far!: number;

  @Prop({ type: Boolean, default: false })
  public exp2!: boolean;

  @Prop({ type: Number, default: 0.005 })
  public density!: number;

  @Watch("color")
  public watchColor() {
    this.m_color.set(this.color);
    this.m_fog.color.set(this.color);
  }
  @Watch("exp2")
  public watchExp() {
    if (this.exp2) {
      this.m_fog = new THREE.FogExp2(this.color, this.density);
    } else {
      this.m_fog = new THREE.Fog(this.color, this.near, this.far);
    }
    this.scene().fog = this.m_fog;
  }
  @Watch("near")
  public watchNear() {
    if (this.m_fog instanceof THREE.Fog) {
      this.m_fog.near = this.near;
    }
  }
  @Watch("near")
  public watchFar() {
    if (this.m_fog instanceof THREE.Fog) {
      this.m_fog.far = this.far;
    }
  }
  @Watch("density")
  public watchDensity() {
    if (this.m_fog instanceof THREE.FogExp2) {
      this.m_fog.density = this.density;
    }
  }

  private m_color!: THREE.Color;
  private m_fog!: THREE.IFog;
  private m_created = false;

  public async created() {
    if (!this.scene) {
      throw new Error(
        "Fog component can only be added as a child to a scene component"
      );
    }

    this.m_color = new THREE.Color(this.color);
    if (this.exp2) {
      this.m_fog = new THREE.FogExp2(this.color, this.density);
    } else {
      this.m_fog = new THREE.Fog(this.color, this.near, this.far);
    }
    const scene = this.scene();
    scene.background = this.m_color;
    scene.fog = this.m_fog;

    this.m_created = true;
  }

  public beforeDestroy() {
    const scene = this.scene();
    scene.fog = null;
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h();
  }
}
