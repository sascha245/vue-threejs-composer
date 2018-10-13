import * as THREE from "three";
import { Component, Mixins, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { CameraFactory } from "../types";
import { ThreeComponent, ThreeSceneComponent } from "./base";

@Component
export class Camera extends Mixins(ThreeComponent, ThreeSceneComponent) {
  @Prop({ required: true })
  private name!: string;

  @Prop({ default: true, type: Boolean })
  private main!: boolean;

  @Prop({ required: true, type: Function })
  public factory!: CameraFactory;

  @Provide("object")
  public provideObject = this.object;

  private m_isMain = false;
  private m_created = false;
  private m_camera!: THREE.Camera;

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

  public async created() {
    console.log("camera created");
    this.m_camera = await this.factory(this.app().renderer.getSize());
    this.onChangeMain();

    this.m_created = true;
  }

  public beforeDestroy() {
    this.onDeactivate();
  }

  public render(h: any) {
    if (!this.main || !this.m_created) {
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
