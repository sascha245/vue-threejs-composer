import * as tslib_1 from "tslib";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ThreeObjectComponent } from "../base";
let Shadows = class Shadows extends Mixins(ThreeObjectComponent) {
    onChangeReceive() {
        this.object().receiveShadow = this.receive;
    }
    onChangeCast() {
        this.object().castShadow = this.cast;
    }
    created() {
        if (!this.object) {
            throw new Error("Shadows property can only be added as child to an object component");
        }
        console.log("shadow created");
        this.onChangeReceive();
        this.onChangeCast();
    }
    render(h) {
        const props = [];
        if (this.receive)
            props.push("receive");
        if (this.cast)
            props.push("cast");
        return <li>Shadow {props.join(",")}</li>;
    }
};
tslib_1.__decorate([
    Prop({
        default: false,
        type: Boolean
    })
], Shadows.prototype, "receive", void 0);
tslib_1.__decorate([
    Prop({
        default: false,
        type: Boolean
    })
], Shadows.prototype, "cast", void 0);
tslib_1.__decorate([
    Watch("receive")
], Shadows.prototype, "onChangeReceive", null);
tslib_1.__decorate([
    Watch("cast")
], Shadows.prototype, "onChangeCast", null);
Shadows = tslib_1.__decorate([
    Component
], Shadows);
export { Shadows };
//# sourceMappingURL=Shadows.jsx.map