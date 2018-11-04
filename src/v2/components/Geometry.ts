import { Component, Mixins, Prop } from "vue-property-decorator";

import { GeometryFactory, GeometryType } from "../core";
import { AssetComponent } from "../mixins";

@Component
export class Geometry extends Mixins(AssetComponent) {
  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ required: true, type: Function })
  public factory!: GeometryFactory;

  public async created() {
    const geometry = this.factory(this.app());
    if (this.bundle()) {
      this.bundle()!.registerAsset(this.name, geometry);
    }
    this.app().assets.geometries.set(this.name, geometry);
  }

  public async beforeDestroy() {
    if (this.bundle()) {
      this.bundle()!.unregisterAsset(this.name);
    }
    this.app().assets.geometries.dispose(this.name);
  }

  public render(h: any) {
    return h();
  }
}
