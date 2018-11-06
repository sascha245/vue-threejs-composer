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

  private m_model!: Promise<ModelType>;

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
      this.m_model = app.loader.load(this.src, this.name) as Promise<ModelType>;
    } else {
      this.m_model = this.factory(app);
    }
    this.overrideMaterials();

    if (this.bundle()) {
      this.bundle()!.registerAsset(this.name, this.m_model);
    }
    app.assets.models.set(this.name, this.m_model);
  }

  public async destroyed() {
    if (this.bundle()) {
      this.bundle()!.unregisterAsset(this.name);
    }
    this.app().assets.models.dispose(this.name);
  }

  public render(h: any) {
    return h();
  }

  private overrideMaterials() {
    const materials = this.getMaterialPromises(this.materials);
    if (materials) {
      this.m_model = this.m_model.then(async asset => {
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
