import * as THREE from "three";
import { Component, Mixins, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { CameraFactory } from "../types";
import { ThreeComponent, ThreeSceneComponent } from "./base";

@Component
export class Camera extends Mixins(ThreeComponent, ThreeSceneComponent) {
  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ required: true, type: Function })
  public factory!: CameraFactory;

  @Provide("object")
  public provideObject = this.object;

  private m_created = false;
  private m_camera!: THREE.Camera;

  public object(): THREE.Object3D {
    return this.m_camera;
  }

  public async created() {
    this.m_camera = await this.factory(this.app());
    this.m_camera.name = this.name;
    this.app().cameraManager.set(this.name, this.m_camera);
    this.m_created = true;
  }

  public beforeDestroy() {
    this.app().cameraManager.remove(this.name);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
