import { Component, Mixins, Prop } from "vue-property-decorator";

import { Application, LightFactory } from "../../core";
import { Entity } from "./Entity";

@Component
export class Light extends Mixins(Entity) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ required: true, type: Function })
  public factory!: LightFactory;

  protected async instantiate(app: Application) {
    const light = await this.factory(app);
    light.name = this.name;
    return light;
  }
}
