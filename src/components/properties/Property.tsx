import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { ThreeObjectComponent } from "../base";

@Component
export class Property extends Mixins(ThreeObjectComponent) {
  @Prop({
    required: true,
    type: String
  })
  private name!: string;

  @Prop({
    required: true
  })
  private value!: any;

  @Watch("value", { deep: true })
  private onChange() {
    const obj: any = this.object!();
    obj[this.name] = this.value;
  }

  public created() {
    if (!this.object) {
      throw new Error(
        "Property can only be added as child to an object component"
      );
    }
    this.onChange();
  }

  public render(h: any) {
    return <div />;
  }
}
