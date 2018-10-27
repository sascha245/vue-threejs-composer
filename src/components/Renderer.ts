import * as THREE from "three";
import { CreateElement } from "vue";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { Application, RendererHandler } from "../core";
import { ThreeComponent } from "./base";

@Component
export class Renderer extends Mixins(ThreeComponent) {
  private isReady = false;

  @Prop({ required: true, type: HTMLCanvasElement })
  public canvas!: HTMLCanvasElement;

  @Prop({ required: true, type: String })
  public scene!: string;

  @Prop({ required: true, type: String })
  public camera!: string;

  @Prop({ default: false, type: Boolean })
  public antialias!: boolean;

  @Prop({ default: false, type: Boolean })
  public shadows!: boolean;

  @Prop({ default: true, type: Boolean })
  public stencil!: boolean;

  @Prop({ default: 0x000000, type: Number })
  public clearColor!: number;

  @Watch("camera")
  private watchCamera() {
    this._handler.setCameraName(this.camera);
  }
  @Watch("scene")
  private watchScene() {
    this._handler.setSceneName(this.scene);
  }

  private _handler!: RendererHandler;

  public async created() {
    this._handler = this.app().renderers.create({
      antialias: this.antialias,
      canvas: this.canvas,
      clearColor: this.clearColor,
      stencil: this.stencil
    });
    this.watchCamera();
    this.watchScene();

    const renderer = this._handler.renderer;
    if (this.shadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
    }
    this.isReady = true;
  }

  public beforeDestroy() {
    this.app().renderers.dispose(this._handler);
  }

  public render(h: CreateElement) {
    if (!this.isReady) {
      return null;
    }
    return h();
  }
}
