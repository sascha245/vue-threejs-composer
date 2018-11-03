import { Component, Mixins, Prop } from "vue-property-decorator";

import { TextureFactory, TextureType } from "../core";
import { AssetComponent } from "../mixins";

@Component
export class Texture extends Mixins(AssetComponent) {
  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ type: Function })
  private factory!: TextureFactory;

  @Prop({ type: String })
  public src?: string;

  public created() {
    const app = this.app();
    if (this.factory) {
      this.asset = this.factory(app);
    } else if (this.src) {
      this.asset = app.loader.texture(this.src, this.name);
    } else {
      throw new Error(
        `Texture "${
          this.name
        }" could not be loaded: no "src" or "factory" props given`
      );
    }
    app.assets.textures.set(this.name, this.asset as Promise<TextureType>);
  }

  public async beforeDestroy() {
    this.app().assets.textures.dispose(this.name);
  }

  public render(h: any) {
    return h();
  }
}
