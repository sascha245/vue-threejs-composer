import * as THREE from "three";
import { Component, Vue } from "vue-property-decorator";

import {
    CameraFactory, components, GeometryFactory, LightFactory, MaterialFactory
} from "@/vue-three";

import { MyBehaviour } from "./MyBehaviour";

@Component({
  components: {
    ...components,
    MyBehaviour
  }
})
export default class About extends Vue {
  public cubeFactory: GeometryFactory | null = null;
  public planeFactory: GeometryFactory | null = null;
  public cubeMaterialFactory: MaterialFactory | null = null;
  public waterMaterialFactory: MaterialFactory | null = null;

  public lightFactory: LightFactory | null = null;
  public cameraFactory: CameraFactory | null = null;

  public canvas: HTMLCanvasElement | null = null;

  public scene1 = {
    name: "First scene",
    active: true,
    camera: {
      position: {
        x: 0,
        y: 10,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      }
    },

    fields: [
      {
        id: "someId-0",
        x: 0,
        y: 0
      },
      {
        id: "someId-1",
        x: 1,
        y: 0
      },
      {
        id: "someId-2",
        x: 2,
        y: 0
      }
    ]
  };
  public scene2 = {
    name: "Second scene",
    active: true
  };

  public scenes = [this.scene1, this.scene2];

  public changeScene(pScene: any) {
    this.scenes.forEach(scene => {
      scene.active = false;
    });
    pScene.active = true;
    console.log("about scene change", this.scenes);
  }

  public created() {
    console.log(this.scene1);

    this.cubeFactory = async () => {
      // await new Promise(r => setTimeout(r, 3000));
      return new THREE.BoxBufferGeometry(1, 2, 1);
    };
    this.planeFactory = async () => {
      // await new Promise(r => setTimeout(r, 3000));
      return new THREE.PlaneBufferGeometry(100, 100);
    };

    this.cubeMaterialFactory = async () => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: "#eeeeee",
        metalness: 0.01
      });
      // mat.color = new THREE.Color("#dddddd");
      return mat;
    };
    this.waterMaterialFactory = async () => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: "#9c9cff",
        metalness: 0.01,
        fog: true
      });
      // mat.color = new THREE.Color("#dddddd");
      return mat;
    };

    this.lightFactory = async () => {
      const light = new THREE.PointLight(0xffffff, 1, 100);

      light.shadow.mapSize.width = 512; // default
      light.shadow.mapSize.height = 512; // default
      light.shadow.camera.near = 0.3; // default
      light.shadow.camera.far = 500; // default

      return light;
    };

    this.cameraFactory = async ({ width, height }) => {
      const viewAngle = 60;
      const nearClipping = 0.1;
      const farClipping = 1000;
      return new THREE.PerspectiveCamera(
        viewAngle,
        width / height,
        nearClipping,
        farClipping
      );
    };
  }

  public mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
  }
}
