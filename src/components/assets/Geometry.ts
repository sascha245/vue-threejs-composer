import { Component, Mixins, Prop } from "vue-property-decorator";

import { GeometryFactory, GeometryType } from "../../core";
import { Asset } from "./Asset";

@Component
export class Geometry extends Mixins(Asset) {
  @Prop({ type: Function })
  public factory!: GeometryFactory;

  protected get assets() {
    return this.app.assets.geometries;
  }

  protected async instantiate(): Promise<GeometryType> {
    if (!this.factory) {
      throw {
        message: `Geometry "${
          this.name
        }" needs a factory property to work correctly`
      };
    }
    return this.factory(this.app);
  }
}
