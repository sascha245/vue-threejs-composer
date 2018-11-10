import { Mesh } from "three";
import { Component, Mixins, Prop } from "vue-property-decorator";

import { MaterialType, ModelFactory, ModelType } from "../../core";
import { stringToArray } from "../../utils/toArray";
import { Asset } from "./Asset";

@Component
export class Model extends Mixins(Asset) {
  @Prop({ type: Function })
  public factory?: ModelFactory;

  @Prop({ type: String })
  public src?: string;

  @Prop({ type: [String, Array], default: () => [] })
  public materials!: string | string[];

  protected get assets() {
    return this.app.assets.models;
  }

  protected async instantiate(): Promise<ModelType> {
    if (this.src) {
      const p = this.app.loader.load(this.src, this.name) as Promise<ModelType>;
      return p.then(this.overrideMaterials);
    }
    if (this.factory) {
      return this.factory(this.app);
    }
    throw {
      message: `Material "${
        this.name
      }" needs a factory property to work correctly`
    };
  }

  private overrideMaterials(model: ModelType) {
    const materials = this.getMaterialPromises(this.materials);
    return Promise.all(materials).then(mats => {
      const meshes = model.children.filter(
        child => child instanceof Mesh
      ) as Mesh[];
      const length = Math.min(mats.length, meshes.length);
      for (let i = 0; i < length; ++i) {
        meshes[i].material = mats[i];
      }
      return Promise.resolve(model);
    });
  }

  private getMaterialPromises(pMaterials: string | string[]) {
    const materials = stringToArray(",", pMaterials);
    return materials.reduce(
      (result, material) => {
        const p = this.app.assets.materials.get(material);
        if (p) {
          result.push(p);
        }
        return result;
      },
      [] as Array<Promise<MaterialType>>
    );
  }
}
