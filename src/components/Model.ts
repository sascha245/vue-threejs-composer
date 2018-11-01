import { Component, Mixins, Prop } from "vue-property-decorator";

import { Utils } from "../core";
import { AssetType, AssetTypes, MaterialType, ModelFactory, ModelType } from "../types";
import { ThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class Model extends Mixins(ThreeComponent, ThreeAssetComponent) {
  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ type: Function })
  public factory!: ModelFactory;

  @Prop({ type: String })
  public src!: string;

  @Prop({ type: [String, Array], default: () => [] })
  public materials!: string | string[];

  public async created() {
    if (!this.factory && !this.src) {
      throw new Error(
        `Model "${
          this.name
        }" could not be loaded: no "src" or "factory" props given`
      );
    }

    if (this.src) {
      this.asset = Utils.loadModel(this.src, this.name);
    } else {
      this.asset = this.factory(this.app());
    }
    this.overrideMaterials();

    this.app().assets.add(this.name, AssetTypes.MODEL, this.asset);
  }

  public async beforeDestroy() {
    this.app().assets.remove(this.name, AssetTypes.MODEL);
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

  private getMaterialPromises(materials: string | string[]) {
    const promises: Array<Promise<AssetType>> = [];

    if (!materials) {
      return promises;
    }
    if (typeof materials === "string") {
      materials = materials.split(",").map(mat => mat.trim());
    }
    if (!Array.isArray(materials)) {
      throw new Error(
        `Model "${
          this.name
        }" could not be loaded: "materials" have to be either a string or an array`
      );
    }
    (materials as string[]).forEach(materialName => {
      const prom = this.app().assets.get(materialName, AssetTypes.MATERIAL);
      if (prom) {
        promises.push(prom);
      }
    });
    return promises;
  }
}
