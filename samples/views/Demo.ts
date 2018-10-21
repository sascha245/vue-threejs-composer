import "../FbxLoader";

import * as THREE from "three";
import { Component, Vue } from "vue-property-decorator";

import {
    Application, AssetTypes, CameraFactory, components, GeometryFactory, LightFactory,
    MaterialFactory
} from "../../src";
import { MyBehaviour } from "./MyBehaviour";

(window as any).THREE = THREE;

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

  public polygonMaterialFactory: MaterialFactory = async (app: Application) => {
    const texture = await app.assets.get("PolygonMini_Tex", AssetTypes.TEXTURE);

    if (!texture) {
      throw new Error("Could not find 'PolygonMini_Tex' texture");
    }

    const mat = new THREE.MeshStandardMaterial({
      color: "#eeeeee",
      metalness: 0.01
    });
    mat.map = texture as THREE.Texture;
    return mat;
  };

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

  public isLoading = true;
  public loadingAmount = 0;
  public loadingTotal = 0;

  public scenes = [this.scene1, this.scene2];

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
      // await new Promise(r => setTimeout(r, 2000));
      return new THREE.BoxBufferGeometry(1, 1, 1);
    };
    this.planeFactory = async () => {
      // await new Promise(r => setTimeout(r, 3000));
      return new THREE.PlaneBufferGeometry(100, 100);
    };

    this.cubeMaterialFactory = async (app: Application) => {
      const texture = await app.assets.get("crateTex", AssetTypes.TEXTURE);

      if (!texture) {
        throw new Error("Could not find 'crateTex' texture");
      }

      const mat = new THREE.MeshPhysicalMaterial({
        color: "#eeeeee",
        metalness: 0.01
      });
      mat.map = texture as THREE.Texture;
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
