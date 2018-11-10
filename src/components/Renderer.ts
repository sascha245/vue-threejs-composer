import { Camera, Color, PCFSoftShadowMap, Scene, WebGLRenderer } from "three";
import { CreateElement } from "vue";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { RendererHandle } from "../core";
import { AppComponent } from "../mixins";

@Component
export class Renderer extends Mixins(AppComponent) {
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

  @Prop({ default: 0xffffff, type: [Number, String] })
  public clearColor!: number | string;

  @Watch("camera")
  private watchCamera() {
    this.m_handler.setCamera(this.camera);
  }
  @Watch("scene")
  private watchScene() {
    this.m_handler.setScene(this.scene);
  }
  @Watch("clearColor")
  private watchClearColor() {
    const color = new Color(this.clearColor as any);
    this.m_renderer.setClearColor(color);
  }

  private m_ready = false;
  private m_handler!: RendererHandle;
  private m_renderer!: WebGLRenderer;
  private m_name!: string;
  private static id = 0;

  protected renderImpl(
    renderer: WebGLRenderer,
    scene?: Scene,
    camera?: Camera
  ) {
    renderer.clearColor();
    if (scene && camera) {
      renderer.render(scene, camera);
    }
  }

  private async created() {
    const renderer = new WebGLRenderer({
      antialias: this.antialias,
      canvas: this.canvas,
      stencil: this.stencil
    });
    this.m_renderer = renderer;

    Renderer.id++;
    this.m_name = "" + Renderer.id;

    this.m_handler = this.app.renderers.create(this.m_name);
    this.m_handler.set(renderer);
    this.m_handler.render = () => {
      const scene = this.m_handler.scene
        ? this.m_handler.scene.get()
        : undefined;
      const camera = this.m_handler.camera
        ? this.m_handler.camera.get()
        : undefined;
      this.renderImpl(renderer, scene, camera);
    };
    this.m_handler.use();

    this.watchClearColor();
    this.watchCamera();
    this.watchScene();

    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    if (this.shadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
    }
    this.m_ready = true;
  }

  private handleResize() {
    const renderer = this.m_handler.get()!;
    const width = renderer.domElement.scrollWidth;
    const height = renderer.domElement.scrollHeight;
    renderer.setSize(width, height);
  }

  private destroyed() {
    window.removeEventListener("resize", this.handleResize);
    this.app.renderers.dispose(this.m_name);
  }

  private render(h: CreateElement) {
    if (!this.m_ready) {
      return null;
    }
    return h();
  }
}
