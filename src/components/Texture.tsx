import * as THREE from "three";
import { Component, Mixins, Prop } from "vue-property-decorator";

import { AssetTypes, TextureFactory, TextureType } from "../types";
import { ThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class Texture extends Mixins(ThreeComponent, ThreeAssetComponent) {
  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ type: Function })
  private factory!: TextureFactory;

  @Prop({ type: String })
  public src?: string;

  public created() {
    if (this.factory) {
      this.asset = this.factory();
    } else if (this.src) {
      this.asset = new Promise<TextureType>((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(this.src!, texture => {
          resolve(texture);
        });
      });
    } else {
      throw new Error(
        `Texture "${
          this.name
        }" could not be loaded: no "src" or "factory" props given`
      );
    }
    this.app().assets.add(this.name, AssetTypes.TEXTURE, this.asset);
  }

  public async beforeDestroy() {
    this.app().assets.remove(this.name, AssetTypes.TEXTURE);
  }

  public render(h: any) {
    return <div />;
  }
}
