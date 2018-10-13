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
    console.log("three mounted");
  }

  public beforeDestroy() {
    console.log("three beforeDestroy");
    this.onDeactivate();
    window.removeEventListener("resize", this.onResize);
    if (this._app) {
      this._app.dispose();
    }
  }

  @Watch("active")
  public onChangeActive() {
    console.log("three active: ", this);
    if (this.active) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  public onDeactivate() {
    console.log("deactivate render loop");
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = undefined;
    }
  }
  public onActivate() {
    console.log("activate render loop");
    if (!this._animationFrame) {
      this.onRender();
    }
  }

  public onRender() {
    this._animationFrame = requestAnimationFrame(this.onRender);
    this._app.update(0);
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

  public render(h: any) {
    return (
      <div className="three">
        <h1>Three</h1>
        {this.isReady ? this.$slots.default : null}
      </div>
    );
  }
}
