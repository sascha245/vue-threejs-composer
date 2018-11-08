import * as THREE from "three";
import { Component, Mixins, Prop } from "vue-property-decorator";

import { Application, GeometryType, MaterialType, ModelType } from "../core";
import { Entity } from "./Entity";

@Component
export class Mesh extends Mixins(Entity) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Prop({ type: String })
  private material!: string;

  @Prop({ type: String })
  private geometry!: string;

  @Prop({ type: String })
  private model!: string;

  protected async instantiate(app: Application) {
    const hasGeomAndMat: boolean = !!(this.geometry && this.material);
    if (!hasGeomAndMat && !this.model) {
      throw new Error(`
        Mesh component could not be created: you need to either specify the model prop or both geometry and material props
      `);
    }

    let mesh;
    if (this.model) {
      mesh = await this.createMeshFromModel();
    } else {
      mesh = await this.createMeshFromGeomAndMat();
    }

    mesh.name = this.name;

    return mesh;
  }

  private async createMeshFromModel() {
    const app = this.app;
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
    const promMat = this.app.assets.materials.get(this.material);
    const promGeom = this.app.assets.geometries.get(this.geometry);

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
