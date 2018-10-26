import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";

import { AssetTypes, GeometryType, MaterialType, ModelType } from "../types";
import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";

@Component
export class Mesh extends Mixins(
  ThreeComponent,
  ThreeSceneComponent,
  ThreeObjectComponent
) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ type: String })
  private material!: string;

  @Prop({ type: String })
  private geometry!: string;

  @Prop({ type: String })
  private model!: string;

  @Provide("object")
  private provideObject = this.getObject;

  private m_mesh!: THREE.Object3D;
  private m_created = false;

  public getObject(): THREE.Object3D {
    return this.m_mesh;
  }

  public async created() {
    if (!this.scene && !this.object) {
      throw new Error(
        "Mesh component could not be created: can only be added as child to an object or mesh component"
      );
    }

    const hasGeomAndMat: boolean = !!(this.geometry && this.material);
    if (!hasGeomAndMat && !this.model) {
      throw new Error(`
        Mesh component could not be created: you need to either specify the model prop or both geometry and material props
      `);
    }

    if (this.model) {
      this.m_mesh = await this.createMeshFromModel();
    } else {
      this.m_mesh = await this.createMeshFromGeomAndMat();
    }

    this.m_mesh.name = this.name;

    const parent = this.object ? this.object() : this.scene();
    parent.add(this.m_mesh);

    this.m_created = true;
  }

  public beforeDestroy() {
    const parent = this.object ? this.object() : this.scene();
    parent.remove(this.m_mesh);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h("div", this.$slots.default);
  }

  private async createMeshFromModel() {
    const model = await this.app().assets.get(this.model, AssetTypes.MODEL);
    if (!model) {
      throw new Error(`
        Mesh component could not be created: could not find model "${
          this.model
        }"
      `);
    }
    return (model as ModelType).clone();
  }

  private async createMeshFromGeomAndMat() {
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

    return new THREE.Mesh(geometry as GeometryType, material as MaterialType);
  }
}
