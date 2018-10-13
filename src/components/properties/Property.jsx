import * as tslib_1 from "tslib";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ThreeObjectComponent } from "../base";
let Property = class Property extends Mixins(ThreeObjectComponent) {
    onChange() {
        const obj = this.object();
        obj[this.name] = this.value;
    }
    created() {
        if (!this.object) {
            throw new Error("Property can only be added as child to an object component");
        }
        this.onChange();
    }
    render(h) {
        return (<div className="property">
        Property {this.name} = {this.value}
      </div>);
    }
};
tslib_1.__decorate([
    Prop({
        required: true,
        type: String
    })
], Property.prototype, "name", void 0);
tslib_1.__decorate([
    Prop({
        required: true
    })
], Property.prototype, "value", void 0);
tslib_1.__decorate([
    Watch("value", { deep: true })
], Property.prototype, "onChange", null);
Property = tslib_1.__decorate([
    Component
], Property);
export { Property };
//# sourceMappingURL=Property.jsx.map