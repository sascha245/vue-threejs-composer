import * as tslib_1 from "tslib";
import { Component, Mixins } from "vue-property-decorator";
import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";
let Behaviour = class Behaviour extends Mixins(ThreeComponent, ThreeSceneComponent, ThreeObjectComponent) {
    ready() {
        if (this.update) {
            this.app().on("update", this.update);
        }
    }
    beforeDestroy() {
        console.log("before destroy behaviour");
        if (this.update) {
            this.app().off("update", this.update);
        }
    }
};
Behaviour = tslib_1.__decorate([
    Component
], Behaviour);
export { Behaviour };
//# sourceMappingURL=Behaviour.jsx.map