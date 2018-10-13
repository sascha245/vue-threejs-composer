import * as tslib_1 from "tslib";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ThreeObjectComponent } from "../base";
let Position = class Position extends Mixins(ThreeObjectComponent) {
    onChange() {
        this.object().position.set(this.value.x, this.value.y, this.value.z);
    }
    created() {
        if (!this.object) {
            throw new Error("Position property can only be added as child to an object component");
        }
        this.onChange();
    }
    render(h) {
        const valueStringify = `[${this.value.x}, ${this.value.y}, ${this.value.z}]`;
        return <li>Position {valueStringify}</li>;
    }
};
tslib_1.__decorate([
    Prop({
        default() {
            return {
                x: 0,
                y: 0,
                z: 0
            };
        }
    })
], Position.prototype, "value", void 0);
tslib_1.__decorate([
    Watch("value", { deep: true })
], Position.prototype, "onChange", null);
Position = tslib_1.__decorate([
    Component
], Position);
export { Position };
//# sourceMappingURL=Position.jsx.map