import { Component, Mixins, Prop, Provide, Vue } from "vue-property-decorator";

import { CameraFactory, CameraHandle } from "../core";
import { ObjectComponent } from "../mixins";

@Component
export class Camera extends Mixins(ObjectComponent) {
  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ required: true, type: Function })
  public factory!: CameraFactory;

  @Provide("object")
  public provideObject = this.getObject;

  private m_active = false;
  private m_camera!: CameraHandle;

  public getObject() {
    return this.m_camera.get();
  }

  public onActivate = async () => {
    this.m_active = true;
  };
  public onDeactivate = async () => {
    this.m_active = false;
    await Vue.nextTick();
  };

  public async created() {
    const app = this.app();
    const sceneHandle = this.scene();
    const scene = sceneHandle ? this.scene()!.get() : undefined;
    if (!scene) {
      throw new Error(
        "Camera component can only be added as child to an object or scene component"
      );
    }

    const camera = await this.factory(app);
    camera.name = this.name;

    this.m_camera = sceneHandle!.cameras.create(this.name);
    this.m_camera.set(camera);
    this.m_camera.onActivate.on(this.onActivate);
    this.m_camera.onDeactivate.on(this.onDeactivate);

    this.m_active = true;

    const parent = this.object ? this.object() : scene;
    parent!.add(this.m_camera.get()!);
  }

  public destroyed() {
    const sceneHandle = this.scene();
    const scene = sceneHandle ? this.scene()!.get() : undefined;
    const parent = this.object ? this.object() : scene;
    parent!.remove(this.m_camera.get()!);
    sceneHandle!.cameras.dispose(this.name);
  }

  public render(h: any) {
    if (!this.m_active) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
