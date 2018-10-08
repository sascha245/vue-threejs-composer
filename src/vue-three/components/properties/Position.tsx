import * as THREE from "three";
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export class Position extends Vue {
  @Inject()
  protected object!: () => THREE.Object3D;

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
    this.object().position.set(this.value.x, this.value.y, this.value.z);
  }

  public created() {
    this.onChange();
  }

  public render(h: any) {
    const valueStringify = `[${this.value.x}, ${this.value.y}, ${
      this.value.z
    }]`;
    return <li>Position {valueStringify}</li>;
  }
}
