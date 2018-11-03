import "../FbxLoader";

import * as THREE from "three";
import { Component, Vue } from "vue-property-decorator";

import { CameraFactory, components, LightFactory, Loader } from "../../src";
import { cubeFactory, planeFactory } from "../factories/geometries";
import { HoverBehaviour } from "./HoverBehaviour";
import { MyBehaviour } from "./MyBehaviour";
import StandardMaterial from "./StandardMaterial";

Loader.registerExtension("fbx", THREE.FBXLoader);

(window as any).THREE = THREE;

@Component({
  components: {
    ...components,
    HoverBehaviour,
    MyBehaviour,
    StandardMaterial
  }
})
export default class Demo extends Vue {
  public cubeFactory = cubeFactory;
  public planeFactory = planeFactory;

  public lightFactory: LightFactory = async () => {
    const light = new THREE.PointLight(0xffffff, 1, 100);

    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.3; // default
    light.shadow.camera.far = 500; // default

    return light;
  };

  public cameraFactory: CameraFactory = async () => {
    const viewAngle = 60;
    const nearClipping = 0.1;
    const farClipping = 1000;
    return new THREE.PerspectiveCamera(
      viewAngle,
      window.innerWidth / window.innerHeight,
      nearClipping,
      farClipping
    );
  };

  public canvas: HTMLCanvasElement | null = null;

  public scene1 = {
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
    fields: new Array()
  };

  public isLoading = true;
  public loadingAmount = 0;
  public loadingTotal = 0;

  public activeScene = "scene1";

  public startLoading() {
    this.isLoading = true;
    console.log("start loading");
  }
  public finishLoading() {
    this.isLoading = false;
    console.log("finish loading");
  }
  public loadingProgress(amount: number, total: number) {
    this.loadingAmount = amount;
    this.loadingTotal = total;
    console.log("loading progress", `${amount} / ${total}`);
  }

  public changeScene(pName: string) {
    this.activeScene = pName;
  }

  public created() {
    let idx = 0;
    for (let x = 0; x < 5; ++x) {
      for (let z = 0; z < 5; ++z) {
        this.scene1.fields.push({
          x,
          z,
          id: `field_${idx}`,
          y: 0
        });
        ++idx;
      }
    }
  }

  public mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
  }
}
