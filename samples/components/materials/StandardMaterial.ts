import { MeshStandardMaterial, Texture } from "three";
import { Component, Mixins, Prop } from "vue-property-decorator";

import { components, MaterialType } from "../../../src";

const { Material } = components;

@Component
export class StandardMaterial extends Mixins(Material) {
  @Prop({ type: String })
  public map!: string;

  @Prop({ type: String, default: "#ffffff" })
  public color!: string;

  @Prop({ type: Number, default: 0.01 })
  public metalness!: number;

  protected async instantiate(): Promise<MaterialType> {
    let texture;
    if (this.map) {
      texture = await this.app.assets.textures.get(this.map);
    }

    const mat = new MeshStandardMaterial({
      color: this.color,
      metalness: this.metalness
    });
    mat.map = texture as Texture;
    return mat;
  }
}
