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

  @Watch("receive")
  private onChangeReceive() {
    this.object().receiveShadow = this.receive;
  }
  @Watch("cast")
  private onChangeCast() {
    this.object().castShadow = this.cast;
  }

  public created() {
    console.log("shadow created");
    this.onChangeReceive();
    this.onChangeCast();
  }

  public render(h: any) {
    const props: string[] = [];
    if (this.receive) props.push("receive");
    if (this.cast) props.push("cast");
    return <li>Shadow {props.join(",")}</li>;
  }
}
