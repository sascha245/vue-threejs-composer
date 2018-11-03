import { Component, Mixins, Prop } from "vue-property-decorator";

import { AssetType, MaterialType, ModelFactory, ModelType } from "../core";
import { AssetComponent } from "../mixins";
import { stringToArray } from "../utils/toArray";

@Component
export class Model extends Mixins(AssetComponent) {
  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ type: Function })
  public factory!: ModelFactory;

  @Prop({ type: String })
  public src!: string;

  @Prop({ type: [String, Array], default: () => [] })
  public materials!: string | string[];

  public async created() {
    const app = this.app();

    if (!this.factory && !this.src) {
      throw new Error(
        `Model "${
          this.name
        }" could not be loaded: no "src" or "factory" props given`
      );
    }

    if (this.src) {
      this.asset = app.loader.load(this.src, this.name);
    } else {
      this.asset = this.factory(app);
    }
    this.overrideMaterials();

    app.assets.models.set(this.name, this.asset as Promise<ModelType>);
  }

  public async beforeDestroy() {
    this.app().assets.models.dispose(this.name);
  }

  public render(h: any) {
    return h();
  }

  private overrideMaterials() {
    const materials = this.getMaterialPromises(this.materials);
    if (materials) {
      this.asset = this.asset.then(async asset => {
        const mats = await Promise.all(materials);
        const model = asset as ModelType;

        const length = Math.min(mats.length, model.children.length);
        for (let i = 0; i < length; ++i) {
          const material = mats[i] as MaterialType;
          const mesh = model.children[i] as THREE.Mesh;
          mesh.material = material;
        }
        return asset;
      });
    }
  }

  private getMaterialPromises(pMaterials: string | string[]) {
    const promises: Array<Promise<AssetType>> = [];
    const materials = stringToArray(",", pMaterials);
    const app = this.app();

    materials.forEach(materialName => {
      const prom = app.assets.materials.get(materialName);
      if (prom) {
        promises.push(prom);
      }
    });
    return promises;
  }
}
