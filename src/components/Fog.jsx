import * as tslib_1 from "tslib";
import * as THREE from "three";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ThreeComponent, ThreeSceneComponent } from "./base";
let Fog = class Fog extends Mixins(ThreeComponent, ThreeSceneComponent) {
    constructor() {
        super(...arguments);
        this.m_created = false;
    }
    watchColor() {
        this.m_color.set(this.color);
        this.m_fog.color.set(this.color);
    }
    watchExp() {
        if (this.exp2) {
            this.m_fog = new THREE.FogExp2(this.color, this.density);
        }
        else {
            this.m_fog = new THREE.Fog(this.color, this.near, this.far);
        }
        this.scene().fog = this.m_fog;
    }
    watchNear() {
        if (this.m_fog instanceof THREE.Fog) {
            this.m_fog.near = this.near;
        }
    }
    watchFar() {
        if (this.m_fog instanceof THREE.Fog) {
            this.m_fog.far = this.far;
        }
    }
    watchDensity() {
        if (this.m_fog instanceof THREE.FogExp2) {
            this.m_fog.density = this.density;
        }
    }
    async created() {
        if (!this.scene) {
            throw new Error("Fog component can only be added as a child to a scene component");
        }
        this.m_color = new THREE.Color(this.color);
        if (this.exp2) {
            this.m_fog = new THREE.FogExp2(this.color, this.density);
        }
        else {
            this.m_fog = new THREE.Fog(this.color, this.near, this.far);
        }
        const scene = this.scene();
        scene.background = this.m_color;
        scene.fog = this.m_fog;
        this.m_created = true;
    }
    beforeDestroy() {
        console.log("fog beforeDestroy");
        const scene = this.scene();
        scene.fog = null;
    }
    render(h) {
        if (!this.m_created) {
            return null;
        }
        return (<div className="fog">
        <span>Fog</span>
      </div>);
    }
};
tslib_1.__decorate([
    Prop({ type: Number, default: 0xffffff })
], Fog.prototype, "color", void 0);
tslib_1.__decorate([
    Prop({ type: Number, default: 1 })
], Fog.prototype, "near", void 0);
tslib_1.__decorate([
    Prop({ type: Number, default: 1000 })
], Fog.prototype, "far", void 0);
tslib_1.__decorate([
    Prop({ type: Boolean, default: false })
], Fog.prototype, "exp2", void 0);
tslib_1.__decorate([
    Prop({ type: Number, default: 0.005 })
], Fog.prototype, "density", void 0);
tslib_1.__decorate([
    Watch("color")
], Fog.prototype, "watchColor", null);
tslib_1.__decorate([
    Watch("exp2")
], Fog.prototype, "watchExp", null);
tslib_1.__decorate([
    Watch("near")
], Fog.prototype, "watchNear", null);
tslib_1.__decorate([
    Watch("near")
], Fog.prototype, "watchFar", null);
tslib_1.__decorate([
    Watch("density")
], Fog.prototype, "watchDensity", null);
Fog = tslib_1.__decorate([
    Component
], Fog);
export { Fog };
//# sourceMappingURL=Fog.jsx.map