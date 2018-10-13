import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { ThreeObjectComponent } from "../base";

@Component
export class Scale extends Mixins(ThreeObjectComponent) {
  @Prop({
    default() {
      return {
        x: 1,
        y: 1,
        z: 1
      };
    }
  })
  private value!: { x: number; y: number; z: number };

  @Watch("value", { deep: true })
  private onChange() {
    this.object!().scale.set(this.value.x, this.value.y, this.value.z);
  }

  public created() {
    if (!this.object) {
      throw new Error(
        "Scale property can only be added as child to an object component"
      );
    }
    this.onChange();
  }

  public render(h: any) {
    const valueStringify = `[${this.value.x}, ${this.value.y}, ${
      this.value.z
    }]`;
    return <li>Scale {valueStringify}</li>;
  }
}
