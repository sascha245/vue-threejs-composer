import * as THREE from "three";
import { Component, Mixins, Prop } from "vue-property-decorator";

import { BehaviourComponent } from "../../src";
import { OrbitControls } from "./OrbitControls";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

@Component
export class MyBehaviour extends Mixins(BehaviourComponent) {
  @Prop()
  public data!: {
    position: Vec3;
    rotation: Vec3;
  };

  private controls!: OrbitControls;
  private camera!: THREE.PerspectiveCamera;

  public created() {
    if (!this.data) {
      throw new Error("Could not initialize MyBehaviour: data is missing");
    }
    this.camera = new THREE.PerspectiveCamera();
    this.controls = new OrbitControls(this.camera);
    this.camera.position.set(
      this.data!.position.x,
      this.data!.position.y,
      this.data!.position.z
    );
    this.camera.rotation.set(
      this.data!.rotation.x,
      this.data!.rotation.y,
      this.data!.rotation.z
    );
    this.data!.position = this.camera.position;
    this.data!.rotation = this.camera.rotation;
    this.controls.update();

    this.ready();
  }

  public beforeDestroy() {
    this.controls.dispose();
  }

  public render(h: any) {
    return h("div");
  }
}
