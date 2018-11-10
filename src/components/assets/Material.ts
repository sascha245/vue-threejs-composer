import { Component, Mixins, Prop } from "vue-property-decorator";

import { MaterialFactory, MaterialType } from "../../core";
import { Asset } from "./Asset";

@Component
export class Material extends Mixins(Asset) {
  @Prop({ type: Function })
  public factory!: MaterialFactory;

  protected get assets() {
    return this.app.assets.materials;
  }

  protected async instantiate(): Promise<MaterialType> {
    if (!this.factory) {
      throw {
        message: `Material "${
          this.name
        }" needs a factory property to work correctly`
      };
    }
    return this.factory(this.app);
  }
}
