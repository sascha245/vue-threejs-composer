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

  private m_texture!: Promise<TextureType>;

  public created() {
    const app = this.app();
    if (this.factory) {
      this.m_texture = this.factory(app);
    } else if (this.src) {
      this.m_texture = app.loader.texture(this.src, this.name);
    } else {
      throw new Error(
        `Texture "${
          this.name
        }" could not be loaded: no "src" or "factory" props given`
      );
    }

    if (this.bundle()) {
      this.bundle()!.registerAsset(this.name, this.m_texture);
    }
    app.assets.textures.set(this.name, this.m_texture);
    console.log("texture created", this.name);
  }

  public async beforeDestroy() {
    if (this.bundle()) {
      this.bundle()!.unregisterAsset(this.name);
    }
    this.app().assets.textures.dispose(this.name);
    console.log("texture disposed", this.name);
  }

  public render(h: any) {
    return h();
  }
}
