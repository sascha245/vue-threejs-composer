import * as THREE from "three";
import { Component, Inject, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { ThreeApplication } from "../core";
import { OrbitControls } from "../core/OrbitCamera";

@Component
export class Camera extends Vue {
  @Inject()
  protected app!: () => ThreeApplication;

  @Prop({ required: true })
  private name!: string;

  @Prop({ default: true, type: Boolean })
  private main!: boolean;

  @Provide("object")
  public provideObject = this.object;

  private m_isMain = false;
  private m_camera!: THREE.PerspectiveCamera;
  private m_controls?: OrbitControls;

  public object(): THREE.Object3D {
    return this.m_camera;
  }

  @Watch("main")
  public async onChangeMain() {
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
    } else {
      this.onDeactivate();
    }
  }

  public onDeactivate() {
    console.log("deactivate camera", this.name);

    const manager = this.app().cameraManager;
    if (this.m_camera === manager.main) {
      manager.main = undefined;
    }
  }

  public async onActivate() {
    console.log("activate camera", this.name);

    const manager = this.app().cameraManager;
    manager.main = this.m_camera;
  }

  public created() {
    console.log("camera created");
    const { width, height } = this.app().renderer.getSize();
    const viewAngle = 60;
    const nearClipping = 0.1;
    const farClipping = 1000;

    this.m_camera = new THREE.PerspectiveCamera(
      viewAngle,
      width / height,
      nearClipping,
      farClipping
    );

    this.m_controls = new OrbitControls(
      this.m_camera,
      this.app().renderer.domElement
    );

    this.onChangeMain();
  }

  public mounted() {
    console.log("camera mounted");
  }

  public beforeDestroy() {
    this.onDeactivate();
    if (this.m_camera && this.m_controls) {
      this.m_controls.dispose();
      this.m_controls = undefined;
    }
  }

  public render(h: any) {
    if (!this.main) {
      return null;
    }
    return (
      <div className="camera">
        <span>Camera</span>
        <ul>{this.$slots.default}</ul>
      </div>
    );
  }
}
