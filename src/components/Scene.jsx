import * as tslib_1 from "tslib";
import * as THREE from "three";
import { Component, Mixins, Prop, Provide, Vue, Watch } from "vue-property-decorator";
import { ThreeAssetComponent, ThreeComponent } from "./base";
let Scene = class Scene extends Mixins(ThreeComponent) {
    constructor() {
        super(...arguments);
        this.provideScene = this.getScene;
        this.m_isReady = false;
        this.m_isActive = false;
    }
    getScene() {
        return this.m_scene;
    }
    async onChangeActive() {
        const manager = this.app().sceneManager;
        if (this.active) {
            await Vue.nextTick();
        }
        this.m_isActive =
            manager.active && manager.active !== this.m_scene ? false : this.active;
        if (this.m_isActive !== this.active) {
            this.$emit("update:active", this.m_isActive);
        }
        if (this.m_isActive) {
            this.onActivate();
        }
        else {
            this.onDeactivate();
        }
    }
    async onDeactivate() {
        console.log("deactivate scene", this.name);
        const manager = this.app().sceneManager;
        if (this.m_scene === manager.active) {
            manager.active = undefined;
        }
        this.m_isReady = false;
        await Vue.nextTick();
        this.m_scene = undefined;
    }
    async onActivate() {
        console.log("activate scene", this.name);
        const manager = this.app().sceneManager;
        this.m_scene = new THREE.Scene();
        manager.active = this.m_scene;
        await Vue.nextTick();
        await this.preloadAssets();
        this.m_isReady = true;
    }
    async preloadAssets() {
        const assets = [];
        const preloadNodes = this.$slots.preload;
        if (preloadNodes) {
            for (const node of preloadNodes) {
                const component = node.componentInstance;
                if (component instanceof ThreeAssetComponent) {
                    assets.push(component.asset);
                }
            }
        }
        return Promise.all(assets);
    }
    mounted() {
        console.log("scene mounted");
        this.onChangeActive();
    }
    beforeDestroy() {
        console.log("scene beforeDestroy");
        this.onDeactivate();
    }
    render(h) {
        console.log("scene render");
        if (!this.m_isActive) {
            return null;
        }
        const whenReady = (<div>
        <h3>Scene ready</h3>
        {this.$slots.default}
      </div>);
        return (<div className="scene">
        <h2>Scene {this.name}</h2>
        <div>
          <h3>Preload</h3>
          {this.$slots.preload}
        </div>
        {this.m_isReady ? whenReady : null}
      </div>);
    }
};
tslib_1.__decorate([
    Prop({ required: true, type: String })
], Scene.prototype, "name", void 0);
tslib_1.__decorate([
    Prop({ default: false, type: Boolean })
], Scene.prototype, "active", void 0);
tslib_1.__decorate([
    Provide("scene")
], Scene.prototype, "provideScene", void 0);
tslib_1.__decorate([
    Watch("active")
], Scene.prototype, "onChangeActive", null);
Scene = tslib_1.__decorate([
    Component
], Scene);
export { Scene };
//# sourceMappingURL=Scene.jsx.map