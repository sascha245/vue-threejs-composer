import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";

import { ObjectComponent } from "../mixins";

@Component
export class Grid extends Mixins(ObjectComponent) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ type: Number, default: 10 })
  private size!: number;

  @Prop({ type: Number, default: 10 })
  private divisions!: number;

  @Provide("object")
  private provideObject = this.getObject;

  private m_grid!: THREE.GridHelper;
  private m_created = false;

  public getObject(): THREE.Object3D {
    return this.m_grid;
  }

  public async created() {
    if (!this.scene() && !this.object()) {
      throw new Error(
        "Grid component can only be added as child to an object or mesh component"
      );
    }

    this.m_grid = new THREE.GridHelper(this.size, this.divisions);
    this.m_grid.name = this.name;

    const parent = this.object ? this.object() : this.scene();
    parent!.add(this.m_grid);

    this.m_created = true;
  }

  public beforeDestroy() {
    const parent = this.object ? this.object() : this.scene();
    parent!.remove(this.m_grid);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
