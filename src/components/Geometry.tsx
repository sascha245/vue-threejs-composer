import { Component, Mixins, Prop } from "vue-property-decorator";

import { AssetTypes, GeometryFactory, GeometryType } from "../types";
import { ThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class Geometry extends Mixins(ThreeComponent, ThreeAssetComponent) {
  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ required: true, type: Function })
  public factory!: GeometryFactory;

  public async created() {
    this.asset = this.factory();
    this.app().assets.add(this.name, AssetTypes.GEOMETRY, this.asset);
  }

  public async beforeDestroy() {
    this.app().assets.remove(this.name, AssetTypes.GEOMETRY);
  }

  public render(h: any) {
    return <div />;
  }
}
