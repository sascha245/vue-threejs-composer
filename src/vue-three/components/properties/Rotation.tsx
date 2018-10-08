import * as THREE from "three";
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export class Rotation extends Vue {
  @Inject()
  protected object!: () => THREE.Object3D;

  @Prop({
    default() {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    },
    type: Object
  })
  private value!: { x: number; y: number; z: number };

  @Prop({
    default: false,
    type: Boolean
  })
  private rad!: boolean;

  @Watch("value", { deep: true })
  private onChange() {
    if (this.rad) {
      this.object().rotation.set(this.value.x, this.value.y, this.value.z);
    } else {
      const rad = THREE.Math.degToRad;
      this.object().rotation.set(
        rad(this.value.x),
        rad(this.value.y),
        rad(this.value.z)
      );
    }
  }

  public created() {
    this.onChange();
  }

  public render(h: any) {
    let vec = this.value;
    if (this.rad) {
      const deg = THREE.Math.radToDeg;
      vec = {
        x: deg(this.value.x),
        y: deg(this.value.y),
        z: deg(this.value.z)
      };
    }
    const valueStringify = `[${vec.x}, ${vec.y}, ${vec.z}]`;
    return <li>Rotation {valueStringify}</li>;
  }
}
