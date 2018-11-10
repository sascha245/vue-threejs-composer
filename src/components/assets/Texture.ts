import { Component, Mixins, Prop } from "vue-property-decorator";

import { TextureFactory, TextureType } from "../../core";
import { Asset } from "./Asset";

@Component
export class Texture extends Mixins(Asset) {
  @Prop({ type: Function })
  public factory?: TextureFactory;

  @Prop({ type: String })
  public src?: string;

  protected get assets() {
    return this.app.assets.textures;
  }

  protected async instantiate(): Promise<TextureType> {
    if (this.src) {
      return this.app.loader.texture(this.src, this.name);
    }
    if (this.factory) {
      return this.factory(this.app);
    }
    throw {
      message: `Material "${
        this.name
      }" needs a factory property to work correctly`
    };
  }
}
