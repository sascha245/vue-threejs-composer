import { Component, Mixins, Prop } from "vue-property-decorator";

import { Application, CameraFactory, CameraHandle } from "../../core";
import { Entity } from "./Entity";

@Component
export class Camera extends Mixins(Entity) {
  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ required: true, type: Function })
  public factory!: CameraFactory;

  private m_handle!: CameraHandle;

  protected async instantiate(app: Application) {
    const camera = await this.factory(app);
    camera.name = this.name;

    this.m_handle = this.scene!.cameras.create(this.name);
    this.m_handle.set(camera);

    return camera;
  }

  protected destroy() {
    this.scene!.cameras.dispose(this.name);
  }
}
