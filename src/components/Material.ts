import { Component, Mixins, Prop } from "vue-property-decorator";

import { AssetTypes, MaterialFactory, MaterialType } from "../types";
import { ThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class Material extends Mixins(ThreeComponent, ThreeAssetComponent) {
  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ required: true, type: Function })
  private factory!: MaterialFactory;

  public created() {
    this.asset = this.factory(this.app());
    this.app().assets.add(this.name, AssetTypes.MATERIAL, this.asset);
  }

  public async beforeDestroy() {
    this.app().assets.remove(this.name, AssetTypes.MATERIAL);
  }

  public render(h: any) {
    return h();
  }
}
