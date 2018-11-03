import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";

import { GeometryType, MaterialType, ModelType } from "../core";
import { ObjectComponent } from "../mixins";

@Component
export class Mesh extends Mixins(ObjectComponent) {
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
    if (!this.scene() && !this.object()) {
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
    parent!.add(this.m_mesh);

    this.m_created = true;
  }

  public beforeDestroy() {
    const parent = this.object ? this.object() : this.scene();
    parent!.remove(this.m_mesh);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h("div", this.$slots.default);
  }

  private async createMeshFromModel() {
    const app = this.app();
    const model = await app.assets.models.get(this.model);
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
    const promMat = this.app().assets.materials.get(this.material);
    const promGeom = this.app().assets.geometries.get(this.geometry);

    if (!promMat) {
      throw new Error(
        `Mesh with name "${this.name}" could not be instanciated: material "${
          this.material
        }" could not be found`
      );
    }
    if (!promGeom) {
      throw new Error(
        `Mesh with name "${this.name}" could not be instanciated: geometry "${
          this.geometry
        }" could not be found`
      );
    }
    const [material, geometry] = await Promise.all([promMat, promGeom]);

    return new THREE.Mesh(geometry as GeometryType, material as MaterialType);
  }
}
