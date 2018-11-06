import { Component, Prop, Vue } from "vue-property-decorator";

import { components } from "../../../src";

const { Mesh, Position, Shadows } = components;

@Component({
  components: {
    Mesh,
    Position,
    Shadows
  }
})
export default class Crate extends Vue {
  @Prop({ required: true })
  public position!: { x: number; y: number; z: number };

  get worldPosition() {
    return {
      x: this.position.x * 2,
      y: this.position.y + 5,
      z: this.position.z * -2
    };
  }
}
