import * as tslib_1 from "tslib";
import { Component, Mixins } from "vue-property-decorator";
import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";
let Property = class Property extends Mixins(ThreeComponent, ThreeSceneComponent, ThreeObjectComponent) {
};
Property = tslib_1.__decorate([
    Component
], Property);
export { Property };
//# sourceMappingURL=Property.jsx.map