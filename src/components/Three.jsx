import * as tslib_1 from "tslib";
import { Component, Prop, Provide, Vue, Watch } from "vue-property-decorator";
import { Application } from "../core";
let Three = class Three extends Vue {
    constructor() {
        super(...arguments);
        this.isReady = false;
        this.provideApp = this.app;
    }
    app() {
        return this._app;
    }
    async created() {
        this._app = new Application({
            antialias: this.antialias,
            canvas: this.canvas
        });
        this.setRendererSize();
        window.addEventListener("resize", this.onResize);
        this.onChangeActive();
        this.isReady = true;
        console.log("three mounted");
    }
    beforeDestroy() {
        console.log("three beforeDestroy");
        this.onDeactivate();
        window.removeEventListener("resize", this.onResize);
        if (this._app) {
            this._app.dispose();
        }
    }
    onChangeActive() {
        console.log("three active: ", this);
        if (this.active) {
            this.onActivate();
        }
        else {
            this.onDeactivate();
        }
    }
    onDeactivate() {
        console.log("deactivate render loop");
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = undefined;
        }
    }
    onActivate() {
        console.log("activate render loop");
        if (!this._animationFrame) {
            this.onRender();
        }
    }
    onRender() {
        this._animationFrame = requestAnimationFrame(this.onRender);
        this._app.update(0);
    }
    onResize() {
        this.setRendererSize();
    }
    setRendererSize() {
        const width = this.canvas.scrollWidth;
        const height = this.canvas.scrollHeight;
        if (this._app) {
            this._app.setSize(width, height);
        }
    }
    render(h) {
        return (<div className="three">
        <h1>Three</h1>
        {this.isReady ? this.$slots.default : null}
      </div>);
    }
};
tslib_1.__decorate([
    Prop({ required: true, type: HTMLCanvasElement })
], Three.prototype, "canvas", void 0);
tslib_1.__decorate([
    Prop({ default: false })
], Three.prototype, "antialias", void 0);
tslib_1.__decorate([
    Prop({ default: true, type: Boolean })
], Three.prototype, "active", void 0);
tslib_1.__decorate([
    Provide("app")
], Three.prototype, "provideApp", void 0);
tslib_1.__decorate([
    Watch("active")
], Three.prototype, "onChangeActive", null);
Three = tslib_1.__decorate([
    Component
], Three);
export { Three };
//# sourceMappingURL=Three.jsx.map