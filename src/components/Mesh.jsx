import * as tslib_1 from "tslib";
import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";
import { AssetTypes } from "../types";
import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";
let Mesh = class Mesh extends Mixins(ThreeComponent, ThreeSceneComponent, ThreeObjectComponent) {
    constructor() {
        super(...arguments);
        this.provideObject = this.getObject;
        this.m_created = false;
    }
    getObject() {
        return this.m_mesh;
    }
    async created() {
        if (!this.scene && !this.object) {
            throw new Error("Mesh component can only be added as child to an object or mesh component");
        }
        const materialProm = this.app().assets.get(this.material, AssetTypes.MATERIAL);
        const geometryProm = this.app().assets.get(this.geometry, AssetTypes.GEOMETRY);
        if (!materialProm) {
            throw new Error(`Mesh with name "${this.name}" could not be instanciated: material "${this.material}" could not be found`);
        }
        if (!geometryProm) {
            throw new Error(`Mesh with name "${this.name}" could not be instanciated: geometry "${this.geometry}" could not be found`);
        }
        const [material, geometry] = await Promise.all([
            materialProm,
            geometryProm
        ]);
        this.m_mesh = new THREE.Mesh(geometry, material);
        const parent = this.object ? this.object() : this.scene();
        parent.add(this.m_mesh);
        this.m_created = true;
    }
    beforeDestroy() {
        console.log("mesh beforeDestroy");
        const parent = this.object ? this.object() : this.scene();
        parent.remove(this.m_mesh);
    }
    render(h) {
        if (!this.m_created) {
            return null;
        }
        return (<div className="mesh">
        <span>Mesh {this.name}</span>
        <ul>{this.$slots.default}</ul>
      </div>);
    }
};
tslib_1.__decorate([
    Prop({ required: true, type: String })
], Mesh.prototype, "name", void 0);
tslib_1.__decorate([
    Prop({ required: true, type: String })
], Mesh.prototype, "material", void 0);
tslib_1.__decorate([
    Prop({ required: true, type: String })
], Mesh.prototype, "geometry", void 0);
tslib_1.__decorate([
    Provide("object")
], Mesh.prototype, "provideObject", void 0);
Mesh = tslib_1.__decorate([
    Component
], Mesh);
export { Mesh };
//# sourceMappingURL=Mesh.jsx.map