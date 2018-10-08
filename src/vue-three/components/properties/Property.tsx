import * as THREE from "three";
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export class Property extends Vue {
  @Inject()
  protected object!: () => THREE.Object3D;

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
    const obj: any = this.object();
    obj[this.name] = this.value;
  }

  public created() {
    this.onChange();
  }

  public render(h: any) {
    return (
      <div className="property">
        Property {this.name} = {this.value}
      </div>
    );
  }
}
