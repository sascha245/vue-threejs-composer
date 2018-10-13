import * as tslib_1 from "tslib";
import { Component, Mixins, Prop, Provide, Vue, Watch } from "vue-property-decorator";
import { ThreeComponent, ThreeSceneComponent } from "./base";
let Camera = class Camera extends Mixins(ThreeComponent, ThreeSceneComponent) {
    constructor() {
        super(...arguments);
        this.provideObject = this.object;
        this.m_isMain = false;
        this.m_created = false;
    }
    object() {
        return this.m_camera;
    }
    async onChangeMain() {
        const manager = this.app().cameraManager;
        if (this.main) {
            await Vue.nextTick();
        }
        this.m_isMain =
            manager.main && manager.main !== this.m_camera ? false : this.main;
        if (this.m_isMain !== this.main) {
            this.$emit("update:main", this.m_isMain);
        }
        if (this.m_isMain) {
            this.onActivate();
        }
        else {
            this.onDeactivate();
        }
    }
    onDeactivate() {
        console.log("deactivate camera", this.name);
        const manager = this.app().cameraManager;
        if (this.m_camera === manager.main) {
            manager.main = undefined;
        }
    }
    async onActivate() {
        console.log("activate camera", this.name);
        const manager = this.app().cameraManager;
        manager.main = this.m_camera;
    }
    async created() {
        console.log("camera created");
        this.m_camera = await this.factory(this.app().renderer.getSize());
        this.onChangeMain();
        this.m_created = true;
    }
    beforeDestroy() {
        this.onDeactivate();
    }
    render(h) {
        if (!this.main || !this.m_created) {
            return null;
        }
        return (<div className="camera">
        <span>Camera</span>
        <ul>{this.$slots.default}</ul>
      </div>);
    }
};
tslib_1.__decorate([
    Prop({ required: true })
], Camera.prototype, "name", void 0);
tslib_1.__decorate([
    Prop({ default: true, type: Boolean })
], Camera.prototype, "main", void 0);
tslib_1.__decorate([
    Prop({ required: true, type: Function })
], Camera.prototype, "factory", void 0);
tslib_1.__decorate([
    Provide("object")
], Camera.prototype, "provideObject", void 0);
tslib_1.__decorate([
    Watch("main")
], Camera.prototype, "onChangeMain", null);
Camera = tslib_1.__decorate([
    Component
], Camera);
export { Camera };
//# sourceMappingURL=Camera.jsx.map