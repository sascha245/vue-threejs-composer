import { Color, Fog as ThreeFog, FogExp2 as ThreeFogExp2, IFog } from "three";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { SceneComponent } from "../../mixins";

@Component
export class Fog extends Mixins(SceneComponent) {
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
    const scene = this.scene ? this.scene!.get() : undefined;
    if (this.exp2) {
      this.m_fog = new ThreeFogExp2(this.color, this.density);
    } else {
      this.m_fog = new ThreeFog(this.color, this.near, this.far);
    }
    scene!.fog = this.m_fog;
  }
  @Watch("near")
  public watchNear() {
    if (this.m_fog instanceof ThreeFog) {
      this.m_fog.near = this.near;
    }
  }
  @Watch("near")
  public watchFar() {
    if (this.m_fog instanceof ThreeFog) {
      this.m_fog.far = this.far;
    }
  }
  @Watch("density")
  public watchDensity() {
    if (this.m_fog instanceof ThreeFogExp2) {
      this.m_fog.density = this.density;
    }
  }

  private m_color!: Color;
  private m_fog!: IFog;

  public created() {
    const scene = this.scene ? this.scene!.get() : undefined;
    if (!scene) {
      throw new Error(
        "Fog component can only be added as a child to a scene component"
      );
    }

    this.m_color = new Color(this.color);
    if (this.exp2) {
      this.m_fog = new ThreeFogExp2(this.color, this.density);
    } else {
      this.m_fog = new ThreeFog(this.color, this.near, this.far);
    }

    scene.background = this.m_color;
    scene.fog = this.m_fog;
  }

  public destroyed() {
    const scene = this.scene ? this.scene!.get() : undefined;
    scene!.fog = null;
  }

  public render(h: any) {
    return h();
  }
}
