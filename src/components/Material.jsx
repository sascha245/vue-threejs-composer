import * as tslib_1 from "tslib";
import { Component, Mixins, Prop } from "vue-property-decorator";
import { AssetTypes } from "../types";
import { ThreeAssetComponent, ThreeComponent } from "./base";
let Material = class Material extends Mixins(ThreeComponent, ThreeAssetComponent) {
    created() {
        console.log("created material", this.name);
        this.asset = this.factory();
        this.app().assets.add(this.name, AssetTypes.MATERIAL, this.asset);
    }
    async beforeDestroy() {
        console.log("beforeDestroy material", this.name);
        this.app().assets.remove(this.name, AssetTypes.MATERIAL);
    }
    render(h) {
        return <div className="material">Material {this.name}</div>;
    }
};
tslib_1.__decorate([
    Prop({ required: true, type: String })
], Material.prototype, "name", void 0);
tslib_1.__decorate([
    Prop({ required: true, type: Function })
], Material.prototype, "factory", void 0);
Material = tslib_1.__decorate([
    Component
], Material);
export { Material };
//# sourceMappingURL=Material.jsx.map