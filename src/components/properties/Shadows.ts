import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { ThreeObjectComponent } from "../base";

@Component
export class Shadows extends Mixins(ThreeObjectComponent) {
  @Prop({
    default: false,
    type: Boolean
  })
  private receive!: boolean;

  @Prop({
    default: false,
    type: Boolean
  })
  private cast!: boolean;

  @Prop({
    default: false,
    type: Boolean
  })
  private recursive!: boolean;

  @Watch("receive")
  private onChangeReceive() {
    this.changeReceive(this.object!());
  }
  @Watch("cast")
  private onChangeCast() {
    this.changeCast(this.object!());
  }

  public created() {
    if (!this.object) {
      throw new Error(
        "Shadows property can only be added as child to an object component"
      );
    }
    this.onChangeReceive();
    this.onChangeCast();
  }

  public render(h: any) {
    return h();
  }

  private changeReceive(obj: THREE.Object3D) {
    obj.receiveShadow = this.receive;
    if (this.recursive && obj.children) {
      obj.children.forEach(this.changeReceive);
    }
  }
  private changeCast(obj: THREE.Object3D) {
    obj.castShadow = this.cast;
    if (this.recursive && obj.children) {
      obj.children.forEach(this.changeCast);
    }
  }
}
