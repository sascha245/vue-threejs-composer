import { PCFSoftShadowMap, WebGLRenderer } from "three";
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

  @Prop({ default: 0x000000, type: Number })
  public clearColor!: number;

  @Watch("camera")
  private watchCamera() {
    this.m_renderer.setCamera(this.camera);
  }
  @Watch("scene")
  private watchScene() {
    this.m_renderer.setScene(this.scene);
  }

  private m_ready = false;
  private m_renderer!: RendererHandle;
  private m_name!: string;
  private static id = 0;

  public async created() {
    const renderer = new WebGLRenderer({
      antialias: this.antialias,
      canvas: this.canvas,
      clearColor: this.clearColor,
      stencil: this.stencil
    });

    Renderer.id++;
    this.m_name = "" + Renderer.id;

    this.m_renderer = this.app().renderers.create(this.m_name);
    this.m_renderer.set(renderer);
    this.m_renderer.render = () => {
      renderer.clearColor();
      const scene = this.m_renderer.scene
        ? this.m_renderer.scene.get()
        : undefined;
      const camera = this.m_renderer.camera
        ? this.m_renderer.camera.get()
        : undefined;
      if (scene && camera) {
        renderer.render(scene, camera);
      }
    };
    this.m_renderer.use();

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
    const renderer = this.m_renderer.get()!;
    const width = renderer.domElement.scrollWidth;
    const height = renderer.domElement.scrollHeight;
    renderer.setSize(width, height);
  }

  public destroyed() {
    window.removeEventListener("resize", this.handleResize);
    this.app().renderers.dispose(this.m_name);
  }

  public render(h: CreateElement) {
    if (!this.m_ready) {
      return null;
    }
    return h();
  }
}
