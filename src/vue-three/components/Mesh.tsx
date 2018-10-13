import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";

import { AssetTypes, GeometryType, MaterialType } from "@/vue-three/types";

import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";

@Component
export class Mesh extends Mixins(
  ThreeComponent,
  ThreeSceneComponent,
  ThreeObjectComponent
) {
  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ required: true, type: String })
  private material!: string;

  @Prop({ required: true, type: String })
  private geometry!: string;

  @Provide("object")
  private provideObject = this.getObject;

  private m_mesh!: THREE.Mesh;
  private m_created = false;

  public getObject(): THREE.Object3D {
    return this.m_mesh;
  }

  public async created() {
    if (!this.scene && !this.object) {
      throw new Error(
        "Mesh component can only be added as child to an object or mesh component"
      );
    }

    const materialProm = this.app().assets.get(
      this.material,
      AssetTypes.MATERIAL
    );
    const geometryProm = this.app().assets.get(
      this.geometry,
      AssetTypes.GEOMETRY
    );

    if (!materialProm) {
      throw new Error(
        `Mesh with name "${this.name}" could not be instanciated: material "${
          this.material
        }" could not be found`
      );
    }
    if (!geometryProm) {
      throw new Error(
        `Mesh with name "${this.name}" could not be instanciated: geometry "${
          this.geometry
        }" could not be found`
      );
    }
    const [material, geometry] = await Promise.all([
      materialProm,
      geometryProm
    ]);

    this.m_mesh = new THREE.Mesh(
      geometry as GeometryType,
      material as MaterialType
    );

    const parent = this.object ? this.object() : this.scene();
    parent.add(this.m_mesh);

    this.m_created = true;
  }

  public beforeDestroy() {
    console.log("mesh beforeDestroy");
    const parent = this.object ? this.object() : this.scene();
    parent.remove(this.m_mesh);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return (
      <div className="mesh">
        <span>Mesh {this.name}</span>
        <ul>{this.$slots.default}</ul>
      </div>
    );
  }
}
