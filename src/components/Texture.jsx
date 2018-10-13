import * as tslib_1 from "tslib";
import * as THREE from "three";
import { Component, Mixins, Prop } from "vue-property-decorator";
import { AssetTypes } from "../types";
import { ThreeAssetComponent, ThreeComponent } from "./base";
let Texture = class Texture extends Mixins(ThreeComponent, ThreeAssetComponent) {
    created() {
        console.log("created texture", this.name);
        if (this.factory) {
            this.asset = this.factory();
        }
        else if (this.src) {
            this.asset = new Promise((resolve, reject) => {
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(this.src, texture => {
                    resolve(texture);
                });
            });
        }
        else {
            throw new Error(`Texture "${this.name}" could not be loaded: no "src" or "factory" props given`);
        }
        this.app().assets.add(this.name, AssetTypes.TEXTURE, this.asset);
    }
    async beforeDestroy() {
        console.log("beforeDestroy texture", this.name);
        this.app().assets.remove(this.name, AssetTypes.TEXTURE);
    }
    render(h) {
        return <div className="texture">Texture {this.name}</div>;
    }
};
tslib_1.__decorate([
    Prop({ required: true, type: String })
], Texture.prototype, "name", void 0);
tslib_1.__decorate([
    Prop({ type: Function })
], Texture.prototype, "factory", void 0);
tslib_1.__decorate([
    Prop({ type: String })
], Texture.prototype, "src", void 0);
Texture = tslib_1.__decorate([
    Component
], Texture);
export { Texture };
//# sourceMappingURL=Texture.jsx.map