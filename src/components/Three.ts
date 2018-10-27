import { CreateElement } from "vue";
import { Component, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { Application } from "../core";

@Component
export class Three extends Vue {
  private isReady = false;

  @Prop({ default: true, type: Boolean })
  public active!: boolean;

  @Provide("app")
  public provideApp = this.getApp;

  private _app!: Application;
  private _animationFrame?: number;
  private _lastUpdate?: number;

  public getApp() {
    return this._app;
  }

  public created() {
    this._app = new Application();
    this.onChangeActive();
    this.isReady = true;

    (window as any).App = this._app;
  }

  public beforeDestroy() {
    this.onDeactivate();
    if (this._app) {
      this._app.dispose();
    }
  }

  @Watch("active")
  public onChangeActive() {
    if (this.active) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  public onDeactivate() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = undefined;
    }
  }
  public onActivate() {
    if (!this._animationFrame) {
      this._lastUpdate = Date.now();
      this.onUpdate();
    }
  }

  public onUpdate() {
    const now = Date.now();
    const deltaTime = (now - this._lastUpdate!) * 0.001;
    this._animationFrame = requestAnimationFrame(this.onUpdate);
    this._app.update(deltaTime);
    this._lastUpdate = now;
  }

  public render(h: CreateElement) {
    if (!this.isReady) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
