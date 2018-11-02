# vue-threejs-composer

/!\ This module is still in development.

Build beautiful and interactive scenes in the easy way.

## Features

This library's strong points:

1. Core features to easily register assets and create objects in your scenes.

2. Asset bundles to efficiently (pre)load and unload your assets when you don't need them anymore

3. Easily load 3D models and assign their materials

4. If necessary, easily create even the most unique geometries, materials and textures with dedicated factory functions.

**Note:** This library focuses on managing your THREE.js assets and objects more than all other aspects. As such, it won't include any basic geometries, materials. These optional features will however later be available in other packages.

### To be removed

For now these features are still included in this package, but will later be moved in optional packages to let this package focus more on the core aspects.

- Behaviour components you can attach to objects, scenes or your application in which you can update whatever needed.

- Inbuild input manager to handle inputs in a more straightforward way.

## Usage

### Installation

1. Install THREE.js:

`npm install three --save`

2. Optionally, install THREE.js typings:

`npm install @types/three --save-dev`

3. Install this package:

`npm install vue-threejs-composer --save`

### Samples

If you want to test out our samples, you can clone our repository and launch our samples with the following commands:

1. Install dependencies

`npm install`

2. Launch development server

`npm run serve`

3. Play around with the files in */samples*. The demo scene is situated at */samples/views/Demo.vue*

### Define your scenes

```html
<div>

  <div>
    <div class="screen">
      <canvas ref="canvas" class="screen-canvas"></canvas>
      <div class="screen-loading" v-if="isLoading">
        <div>
          <p>Loading...</p>
          <p>{{loadingAmount}} / {{loadingTotal}}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="canvas">
    <three>
        <renderer :canvas="canvas" camera="main" :scene="activeScene" antialias shadows/>

        <asset-bundle name="PolygonMini" preload>
          <texture name="PolygonMini_Tex" src="/assets/textures/PolygonMinis_Texture_01.png"/>

          <material name="PolygonMini_Mat" :factory="polygonMaterialFactory"/>

          <model name="grassModel" src="/assets/models/SM_Env_Grass_01.fbx" materials="PolygonMini_Mat"/>
          <model name="PM_column" src="/assets/models/SM_Tile_Hex_Column_02.fbx" materials="PolygonMini_Mat"/>
          <model name="PM_flat" src="/assets/models/SM_Tile_Hex_Flat_01.fbx" materials="PolygonMini_Mat"/>
        </asset-bundle>

        <asset-bundle name="Basics" preload>
          <geometry name="cube" :factory="cubeFactory"/>
          <geometry name="plane" :factory="planeFactory"/>
        </asset-bundle>

        <asset-bundle name="Crate" dependencies="Basics" preload>
          <texture name="crateTex" src="/assets/textures/crate.jpg"/>
          <material name="cubeMat" :factory="cubeMaterialFactory"/>
        </asset-bundle>

        <asset-bundle name="Water" dependencies="Basics" preload>
          <material name="waterMat" :factory="waterMaterialFactory"/>
        </asset-bundle>

        <scene name="scene1" assets="PolygonMini, Water, Crate" @load="startLoading" @load-progress="loadingProgress" @loaded="finishLoading">

          <fog exp2/>

          <camera name="main" :factory="cameraFactory">
            <position :value="scene1.camera.position"/>
            <rotation :value="scene1.camera.rotation" rad/>
          </camera>

          <light name="sun" :factory="lightFactory">
            <position :value="{x: -5, y: 10, z: -5}"/>
            <shadows cast/>
          </light>

          <grid>
            <position :value="{ x: -10, y: 0.5, z: -10 }"/>
          </grid>
          <axes>
            <position :value="{ x: -10, y: 0.5, z: -10 }"/>
          </axes>

          <group>
            <position :value="{ x: 0, y: 0, z: 0 }"/>

            <mesh name="waterPlane" geometry="plane" material="waterMat">
              <rotation :value="{ x: -90, y: 0, z: 0 }"/>
              <shadows receive/>
            </mesh>

            <mesh model="grassModel" name="grass">
              <position :value="{ x: 10, y: 0, z: 10 }"/>
              <scale :value="{ x: 0.05, y: 0.05, z: 0.05 }"/>
              <shadows cast receive recursive/>
            </mesh>

            <mesh v-for="field in scene1.fields"
              :key="field.id"
              geometry="cube"
              material="cubeMat"
              >
              <position :value="{ x: field.x * 2, y: field.y + 5, z: field.z * -2}"/>
              <shadows cast receive/>

              <hover-behaviour :position="field" :distance="5"/>
            </mesh>
          </group>

        </scene>

    </three>
  </div>
</div>
```

Naturally, you would normally split this component into multiple smaller ones.
Here what your component could look like on the script side:

```ts
import "../FbxLoader";

import * as THREE from "three";
import { Component, Vue } from "vue-property-decorator";

import {
    Application, AssetTypes, CameraFactory, components, GeometryFactory, LightFactory,
    MaterialFactory
} from "vue-threejs-composer";
import { HoverBehaviour } from "./HoverBehaviour";

@Component({
  components: {
    ...components,
    HoverBehaviour
  }
})
export default class About extends Vue {
  public cubeFactory: GeometryFactory = async (app: Application) => {
    return new THREE.BoxBufferGeometry(1, 1, 1);
  };

  public planeFactory: GeometryFactory = async (app: Application) => {
    return new THREE.PlaneBufferGeometry(100, 100);
  };

  public cubeMaterialFactory: MaterialFactory = async (app: Application) => {
    const texture = await app.assets.get("crateTex", AssetTypes.TEXTURE);

    if (!texture) {
      throw new Error("Could not find 'crateTex' texture");
    }
    const mat = new THREE.MeshPhysicalMaterial({
      metalness: 0.01
    });
    mat.map = texture as THREE.Texture;
    return mat;
  };

  public waterMaterialFactory: MaterialFactory = async (app: Application) => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: "#9c9cff",
      metalness: 0.01
    });
    return mat;
  };

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

  public activeScene = this.scene1.name;

  public startLoading() {
    this.isLoading = true;
  }
  public finishLoading() {
    this.isLoading = false;
  }
  public loadingProgress(amount: number, total: number) {
    this.loadingAmount = amount;
    this.loadingTotal = total;
  }

  public changeScene(name: string) {
    this.activeScene = name;
  }

  public mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
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
}

```


### Define custom behaviours

```ts
import { Component, Mixins, Prop } from "vue-property-decorator";

import { Behaviour } from "vue-threejs-composer";

@Component
export class HoverBehaviour extends Mixins(Behaviour) {
  @Prop({ required: true, type: Object })
  public position!: { x: number, y: number, z: number };

  @Prop({ type: Number, default: 1 })
  public distance!: number;

  @Prop({ type: Number, default: 1 })
  public speed!: number;

  private m_moveUp = true;
  private m_originalY = 0;

  public created() {
    // access app
    const app = this.app();

    // access scene if behaviour is placed in a scene
    const scene = this.scene();

    // access object if behaviour is placed in an object
    const object = this.object();

    this.m_originalY = this.position.y;

    // once your component is ready
    this.ready();
  }

  // lifecycle function called before each frame (optional)
  public update(deltaTime: number) {
    this.position.y += deltaTime * (this.m_moveUp ? 1 : -1) * this.speed;

    if (this.position.y > (this.m_originalY + this.distance)) {
      this.m_moveUp = false;
    } else if (this.position.y < (this.m_originalY - this.distance)) {
      this.m_moveUp = true;
    }
  }

  public beforeDestroy() {
    // dispose everything that needs to be disposed here
  }

  public render(h: any) {
    return h("div");
  }
}
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) for details

## Acknowledgments

- First version of a input manager based on [pinput](https://github.com/ichub/pinput)
- Handling of multiple renderer inspired by [vue-gl](https://github.com/vue-gl/vue-gl)
