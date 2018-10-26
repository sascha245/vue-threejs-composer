import { CreateElement } from "vue";
import { Component, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { Application } from "../core";

@Component
export class Three extends Vue {
  private isReady = false;

  @Prop({ required: true, type: HTMLCanvasElement })
  public canvas!: HTMLCanvasElement;

  @Prop({ default: false })
  public antialias!: boolean;

  @Prop({ default: true, type: Boolean })
  public active!: boolean;

  @Provide("app")
  public provideApp = this.app;

  private _app!: Application;
  private _animationFrame?: number;
  private _lastUpdate?: number;

  public app() {
    return this._app;
  }

  public async created() {
    this._app = new Application({
      antialias: this.antialias,
      canvas: this.canvas
    });
    this.setRendererSize();

    window.addEventListener("resize", this.onResize);
    this.onChangeActive();
    this.isReady = true;
  }

  public beforeDestroy() {
    this.onDeactivate();
    window.removeEventListener("resize", this.onResize);
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
      this.onRender();
    }
  }

  public onRender() {
    const now = Date.now();
    const deltaTime = (now - this._lastUpdate!) * 0.001;
    this._animationFrame = requestAnimationFrame(this.onRender);
    this._app.update(deltaTime);
    this._lastUpdate = now;
  }

  private onResize() {
    this.setRendererSize();
  }

  private setRendererSize() {
    const width = this.canvas.scrollWidth;
    const height = this.canvas.scrollHeight;
    if (this._app) {
      this._app.setSize(width, height);
    }
  }

  public render(h: CreateElement) {
    if (!this.isReady) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
