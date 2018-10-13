import * as tslib_1 from "tslib";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ThreeObjectComponent } from "../base";
let Scale = class Scale extends Mixins(ThreeObjectComponent) {
    onChange() {
        this.object().scale.set(this.value.x, this.value.y, this.value.z);
    }
    created() {
        if (!this.object) {
            throw new Error("Scale property can only be added as child to an object component");
        }
        this.onChange();
    }
    render(h) {
        const valueStringify = `[${this.value.x}, ${this.value.y}, ${this.value.z}]`;
        return <li>Scale {valueStringify}</li>;
    }
};
tslib_1.__decorate([
    Prop({
        default() {
            return {
                x: 1,
                y: 1,
                z: 1
            };
        }
    })
], Scale.prototype, "value", void 0);
tslib_1.__decorate([
    Watch("value", { deep: true })
], Scale.prototype, "onChange", null);
Scale = tslib_1.__decorate([
    Component
], Scale);
export { Scale };
//# sourceMappingURL=Scale.jsx.map