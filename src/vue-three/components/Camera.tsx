import * as THREE from "three";
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";

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

  @Prop({
    default() {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  })
  private position!: { x: number; y: number; z: number };

  @Prop({
    default() {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  })
  private rotation!: { x: number; y: number; z: number };

  private m_isMain = false;
  private m_camera!: THREE.Camera;
  private m_controls?: OrbitControls;

  @Watch("position", { deep: true })
  private onChangePosition() {
    this.m_camera.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
  }

  @Watch("rotation", { deep: true })
  private onChangeRotation() {
    const rad = THREE.Math.degToRad;
    this.m_camera.rotation.set(
      rad(this.rotation.x),
      rad(this.rotation.y),
      rad(this.rotation.z)
    );
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

  public mounted() {
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

    this.onChangePosition();
    this.onChangeRotation();
    this.m_controls = new OrbitControls(
      this.m_camera,
      this.app().renderer.domElement
    );

    this.onChangeMain();
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
    return <div className="camera">Camera</div>;
  }
}
