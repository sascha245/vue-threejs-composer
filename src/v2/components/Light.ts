import { Light as ThreeLight, Object3D } from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";

import { LightFactory } from "../core";
import { ObjectComponent } from "../mixins";

@Component
export class Light extends Mixins(ObjectComponent) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ required: true, type: Function })
  public factory!: LightFactory;

  @Provide("object")
  public provideObject = this.getObject;

  private m_created = false;
  private m_light!: ThreeLight;

  public getObject(): Object3D {
    return this.m_light;
  }

  public async created() {
    if (!this.scene() && !this.object()) {
      throw new Error(
        "Light component can only be added as child to an object or scene component"
      );
    }

    this.m_light = await this.factory(this.app());
    this.m_light.name = this.name;
    const parent = this.object ? this.object() : this.scene();
    parent!.add(this.m_light);

    this.m_created = true;
  }

  public beforeDestroy() {
    const parent = this.object ? this.object() : this.scene();
    parent!.remove(this.m_light);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
