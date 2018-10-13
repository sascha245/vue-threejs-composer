import * as tslib_1 from "tslib";
import { Component, Mixins, Prop } from "vue-property-decorator";
import { AssetTypes } from "../types";
import { ThreeAssetComponent, ThreeComponent } from "./base";
let Geometry = class Geometry extends Mixins(ThreeComponent, ThreeAssetComponent) {
    async created() {
        console.log("created geometry", this.name);
        this.asset = this.factory();
        this.app().assets.add(this.name, AssetTypes.GEOMETRY, this.asset);
    }
    async beforeDestroy() {
        console.log("beforeDestroy geometry", this.name);
        this.app().assets.remove(this.name, AssetTypes.GEOMETRY);
    }
    render(h) {
        return <div className="geometry">Geometry {this.name}</div>;
    }
};
tslib_1.__decorate([
    Prop({ required: true, type: String })
], Geometry.prototype, "name", void 0);
tslib_1.__decorate([
    Prop({ required: true, type: Function })
], Geometry.prototype, "factory", void 0);
Geometry = tslib_1.__decorate([
    Component
], Geometry);
export { Geometry };
//# sourceMappingURL=Geometry.jsx.map