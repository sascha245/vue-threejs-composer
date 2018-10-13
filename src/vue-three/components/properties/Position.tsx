import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { ThreeObjectComponent } from "../base";

@Component
export class Position extends Mixins(ThreeObjectComponent) {
  @Prop({
    default() {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  })
  private value!: { x: number; y: number; z: number };

  @Watch("value", { deep: true })
  private onChange() {
    this.object!().position.set(this.value.x, this.value.y, this.value.z);
  }

  public created() {
    if (!this.object) {
      throw new Error(
        "Position property can only be added as child to an object component"
      );
    }
    this.onChange();
  }

  public render(h: any) {
    const valueStringify = `[${this.value.x}, ${this.value.y}, ${
      this.value.z
    }]`;
    return <li>Position {valueStringify}</li>;
  }
}
