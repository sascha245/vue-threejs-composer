import { Component, Inject, Prop, Vue } from "vue-property-decorator";

import { ThreeAssetComponent } from "../core";
import { AssetTypes, MaterialFactory, MaterialType } from "../types";

@Component
export class Material extends ThreeAssetComponent<MaterialType> {
  // @Inject()
  // private app!: () => ThreeApplication;

  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ required: true, type: Function })
  private factory!: MaterialFactory;

  public mounted() {
    console.log("mounted material", this.name);
    this.asset = this.factory();
    this.app().assets.add(this.name, AssetTypes.MATERIAL, this.asset);
  }

  public async beforeDestroy() {
    console.log("beforeDestroy material", this.name);
    this.app().assets.remove(this.name, AssetTypes.MATERIAL);
  }

  public render(h: any) {
    return <div className="material">Material {this.name}</div>;
  }
}
