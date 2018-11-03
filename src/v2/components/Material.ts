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
    this.asset = this.factory(this.app());
    this.app().assets.materials.set(this.name, this.asset as Promise<
      MaterialType
    >);
  }

  public async beforeDestroy() {
    this.app().assets.materials.dispose(this.name);
  }

  public render(h: any) {
    return h();
  }
}
