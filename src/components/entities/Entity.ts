import { Object3D } from "three";
import { Component, Mixins, Provide } from "vue-property-decorator";

import { Application } from "../../core";
import { ObjectComponent, ObjectType } from "../../mixins";
import { Provider } from "../../utils/provider";

@Component
export class Entity extends Mixins(ObjectComponent) {
  @Provide("object")
  private provideObject = Provider.defaultValue<ObjectType>();

  private m_object!: ObjectType;
  private m_created = false;

  protected instantiate(app: Application): Promise<ObjectType> {
    return Promise.resolve(new Object3D());
  }
  protected destroy() {}

  private async created() {
    const scene = this.scene ? this.scene.get() : undefined;
    if (!scene) {
      const message = `${
        this.$options.name
      } component must be placed in a scene component`;
      throw {
        message,
        code: "undefined_scene"
      };
    }

    this.m_object = await this.instantiate(this.app);
    const parent = this.object ? this.object : scene;
    parent!.add(this.m_object);

    Provider.setValue<ObjectType>(this.provideObject, this.m_object);

    this.m_created = true;
  }

  private destroyed() {
    if (this.scene) {
      this.destroy();
      const scene = this.scene ? this.scene.get() : undefined;
      const parent = this.object ? this.object : scene;
      parent!.remove(this.m_object);
    }
  }

  private render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
