import * as tslib_1 from "tslib";
import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";
import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";
let Group = class Group extends Mixins(ThreeComponent, ThreeSceneComponent, ThreeObjectComponent) {
    constructor() {
        super(...arguments);
        this.provideObject = this.getObject;
        this.m_created = false;
    }
    getObject() {
        return this.m_group;
    }
    async created() {
        if (!this.scene && !this.object) {
            throw new Error("Group component can only be added as child to an object or scene component");
        }
        this.m_group = new THREE.Group();
        const parent = this.object ? this.object() : this.scene();
        parent.add(this.m_group);
        this.m_created = true;
    }
    beforeDestroy() {
        console.log("group beforeDestroy");
        const parent = this.object ? this.object() : this.scene();
        parent.remove(this.m_group);
    }
    render(h) {
        if (!this.m_created) {
            return null;
        }
        return (<div className="group">
        <span>Group {this.name}</span>
        <ul>{this.$slots.default}</ul>
      </div>);
    }
};
tslib_1.__decorate([
    Prop({ required: true })
], Group.prototype, "name", void 0);
tslib_1.__decorate([
    Provide("object")
], Group.prototype, "provideObject", void 0);
Group = tslib_1.__decorate([
    Component
], Group);
export { Group };
//# sourceMappingURL=Group.jsx.map