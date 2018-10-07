import * as THREE from "three";
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";

import { AssetTypes, GeometryType, MaterialType } from "@/vue-three/types";

import { ThreeApplication } from "../core";

@Component
export class Mesh extends Vue {
  @Inject()
  private app!: () => ThreeApplication;

  @Inject()
  private scene!: () => THREE.Scene;

  @Prop({ required: true, type: String })
  private name!: string;

  @Prop({ required: true, type: String })
  private material!: string;

  @Prop({ required: true, type: String })
  private geometry!: string;

  @Prop({
    default() {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  })
  private position!: { x: number; y: number; z: number };

  @Prop({
    default() {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  })
  private rotation!: { x: number; y: number; z: number };

  @Prop({ default: false, type: Boolean })
  private receiveShadow!: boolean;

  @Prop({ default: false, type: Boolean })
  private castShadow!: boolean;

  private m_mesh!: THREE.Mesh;

  @Watch("receiveShadow")
  private onChangeReceiveShadow() {
    this.m_mesh.receiveShadow = this.receiveShadow;
  }

  @Watch("castShadow")
  private onChangeCastShadow() {
    this.m_mesh.castShadow = this.castShadow;
  }

  @Watch("position", { deep: true })
  private onChangePosition() {
    this.m_mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  @Watch("rotation", { deep: true })
  private onChangeRotation() {
    const rad = THREE.Math.degToRad;
    this.m_mesh.rotation.set(
      rad(this.rotation.x),
      rad(this.rotation.y),
      rad(this.rotation.z)
    );
  }

  public async mounted() {
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
    this.onChangePosition();
    this.onChangeRotation();
    this.onChangeReceiveShadow();
    this.onChangeCastShadow();
    this.scene().add(this.m_mesh);
  }

  public beforeDestroy() {
    console.log("mesh beforeDestroy");
    if (this.scene()) {
      console.log("mesh remove from scene");
      this.scene().remove(this.m_mesh);
    }
  }

  public render(h: any) {
    return <div className="mesh">Mesh {this.name}</div>;
  }
}
