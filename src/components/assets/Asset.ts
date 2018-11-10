import { Component, Mixins, Prop } from "vue-property-decorator";

import { AssetMap, AssetType } from "../../core";
import { AssetComponent } from "../../mixins";

@Component
export class Asset extends Mixins(AssetComponent) {
  @Prop({ required: true, type: String })
  protected name!: string;

  protected get assets(): AssetMap<AssetType> {
    throw {
      message: `Asset "assets" getter needs to be overwritten`,
      code: "no_assets_override"
    };
  }

  protected instantiate(): Promise<AssetType> {
    return Promise.reject({
      message: `Asset "instantiate" method needs to be overwritten`,
      code: "no_instantiate_override"
    });
  }

  private created() {
    const asset = this.instantiate();
    if (this.bundle) {
      this.bundle.registerAsset(this.name, asset);
    }
    this.assets.set(this.name, asset);
  }

  private async destroyed() {
    if (this.bundle) {
      this.bundle.unregisterAsset(this.name);
    }
    this.assets.dispose(this.name);
  }

  private render(h: any) {
    return h();
  }
}
