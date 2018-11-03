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
    this.asset = this.factory(this.app());
    this.app().assets.geometries.set(this.name, this.asset as Promise<
      GeometryType
    >);
  }

  public async beforeDestroy() {
    this.app().assets.geometries.dispose(this.name);
  }

  public render(h: any) {
    return h();
  }
}
