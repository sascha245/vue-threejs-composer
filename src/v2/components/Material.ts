import { Component, Mixins, Prop } from "vue-property-decorator";

import { MaterialFactory, MaterialType } from "../core";
import { AssetComponent } from "../mixins";

@Component
export class Material extends Mixins(AssetComponent) {
  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ required: true, type: Function })
  private factory!: MaterialFactory;

  public created() {
    const material = this.factory(this.app());
    if (this.bundle()) {
      this.bundle()!.registerAsset(this.name, material);
    }
    this.app().assets.materials.set(this.name, material);
  }

  public async destroyed() {
    if (this.bundle()) {
      this.bundle()!.unregisterAsset(this.name);
    }
    this.app().assets.materials.dispose(this.name);
  }

  public render(h: any) {
    return h();
  }
}
