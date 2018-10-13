import * as tslib_1 from "tslib";
import * as THREE from "three";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ThreeObjectComponent } from "../base";
let Rotation = class Rotation extends Mixins(ThreeObjectComponent) {
    onChange() {
        if (this.rad) {
            this.object().rotation.set(this.value.x, this.value.y, this.value.z);
        }
        else {
            const rad = THREE.Math.degToRad;
            this.object().rotation.set(rad(this.value.x), rad(this.value.y), rad(this.value.z));
        }
    }
    created() {
        if (!this.object) {
            throw new Error("Rotation property can only be added as child to an object component");
        }
        this.onChange();
    }
    render(h) {
        const vec = this.value;
        // if (this.rad) {
        //   const deg = THREE.Math.radToDeg;
        //   vec = {
        //     x: deg(this.value.x),
        //     y: deg(this.value.y),
        //     z: deg(this.value.z)
        //   };
        // }
        const type = this.rad ? "rad" : "deg";
        const valueStringify = `${type}[${vec.x}, ${vec.y}, ${vec.z}]`;
        return <li>Rotation {valueStringify}</li>;
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
        },
        type: Object
    })
], Rotation.prototype, "value", void 0);
tslib_1.__decorate([
    Prop({
        default: false,
        type: Boolean
    })
], Rotation.prototype, "rad", void 0);
tslib_1.__decorate([
    Watch("value", { deep: true })
], Rotation.prototype, "onChange", null);
Rotation = tslib_1.__decorate([
    Component
], Rotation);
export { Rotation };
//# sourceMappingURL=Rotation.jsx.map