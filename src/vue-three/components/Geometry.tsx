import { Component, Prop } from "vue-property-decorator";

import { ThreeAssetComponent } from "../core";
import { AssetTypes, GeometryFactory, GeometryType } from "../types";

@Component
export class Geometry extends ThreeAssetComponent<GeometryType> {
  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ required: true, type: Function })
  public factory!: GeometryFactory;

  public async mounted() {
    console.log("mounted geometry", this.name);
    this.asset = this.factory();
    this.app().assets.add(this.name, AssetTypes.GEOMETRY, this.asset);
  }

  public async beforeDestroy() {
    console.log("beforeDestroy geometry", this.name);
    this.app().assets.remove(this.name, AssetTypes.GEOMETRY);
  }

  public render(h: any) {
    return <div className="geometry">Geometry {this.name}</div>;
  }
}
