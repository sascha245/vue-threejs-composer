import * as tslib_1 from "tslib";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";
import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";
let Light = class Light extends Mixins(ThreeComponent, ThreeSceneComponent, ThreeObjectComponent) {
    constructor() {
        super(...arguments);
        this.provideObject = this.getObject;
        this.m_created = false;
    }
    getObject() {
        return this.m_light;
    }
    async created() {
        if (!this.scene && !this.object) {
            throw new Error("Light component can only be added as child to an object or scene component");
        }
        this.m_light = await this.factory();
        const parent = this.object ? this.object() : this.scene();
        parent.add(this.m_light);
        this.m_created = true;
    }
    beforeDestroy() {
        console.log("light beforeDestroy");
        const parent = this.object ? this.object() : this.scene();
        parent.remove(this.m_light);
    }
    render(h) {
        if (!this.m_created) {
            return null;
        }
        return (<div className="light">
        <span>Light {this.name}</span>
        <ul>{this.$slots.default}</ul>
      </div>);
    }
};
tslib_1.__decorate([
    Prop({ required: true })
], Light.prototype, "name", void 0);
tslib_1.__decorate([
    Prop({ required: true, type: Function })
], Light.prototype, "factory", void 0);
tslib_1.__decorate([
    Provide("object")
], Light.prototype, "provideObject", void 0);
Light = tslib_1.__decorate([
    Component
], Light);
export { Light };
//# sourceMappingURL=Light.jsx.map