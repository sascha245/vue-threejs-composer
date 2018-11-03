import { MeshStandardMaterial, Texture } from "three";
import { Component, Prop, Vue } from "vue-property-decorator";

import { Application, components, MaterialFactory } from "../../src";

const { Material } = components;

@Component({
  components: {
    Material
  }
})
export default class StandardMaterial extends Vue {
  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ type: String })
  public map!: string;

  @Prop({ type: String, default: "#ffffff" })
  public color!: string;

  @Prop({ type: Number, default: 0.01 })
  public metalness!: number;

  public factory: MaterialFactory | null = null;

  public created() {
    this.factory = async (app: Application) => {
      let texture;
      if (this.map) {
        texture = await app.assets.textures.get(this.map);
      }

      const mat = new MeshStandardMaterial({
        color: this.color,
        metalness: this.metalness
      });
      mat.map = texture as Texture;
      return mat;
    };
  }
}
