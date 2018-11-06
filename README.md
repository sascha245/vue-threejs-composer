# vue-threejs-composer

Build beautiful and interactive scenes in the easy way.

## What?

This library focuses on managing your THREE.js assets and objects, but nothing more. As such, it won't include any basic geometries, materials, as you can easily implement custom ones yourself as we will see later.

## Features

This library's strong points:

1. Core features to easily register assets and create objects in your scenes.

2. Asset bundles to efficiently (pre)load and unload your assets when you don't need them anymore

3. Easily load 3D models and assign their materials

4. Easily create custom geometries and materials with dedicated factory functions.


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

#### Define your scenes

```html
<div>

  <canvas ref="canvas"></canvas>
  <div v-if="canvas">
    <three>
        <renderer :canvas="canvas" :camera="activeCamera" :scene="activeScene" antialias shadows/>

        <asset-bundle name="PolygonMini" preload>
          <texture name="PolygonMini_Tex" src="/assets/textures/PolygonMinis_Texture_01.png"/>

          <standard-material name="PolygonMini_Mat" map="PolygonMini_Tex"/>

          <model name="PM_column" src="/assets/models/SM_Tile_Hex_Column_02.fbx" materials="PolygonMini_Mat"/>
          <model name="PM_flat" src="/assets/models/SM_Tile_Hex_Flat_01.fbx" materials="PolygonMini_Mat"/>
        </asset-bundle>

        <asset-bundle name="Forms">
          <geometry name="cube" :factory="cubeFactory"/>
          <geometry name="plane" :factory="planeFactory"/>
        </asset-bundle>

        <asset-bundle dependencies="Forms" name="Water" preload>
          <standard-material name="waterMat" color="#9c9cff"/>
        </asset-bundle>

        <scene name="scene1" assets="PolygonMini, Water">

          <fog exp2/>

          <camera name="main" :factory="cameraFactory">
            <position :value="scene1.camera.position"/>
            <rotation :value="scene1.camera.rotation" rad/>
            <orbit-behaviour :data="scene1.camera"/>
          </camera>

          <light name="sun" :factory="lightFactory">
            <position :value="{x: -5, y: 10, z: -5}"/>
            <shadows cast/>
          </light>

          <mesh geometry="plane" material="waterMat">
            <rotation :value="{ x: -90, y: 0, z: 0 }"/>
            <shadows receive/>
          </mesh>

          <group>
            <position :value="{ x: 10, y: 3, z: 10 }"/>
            <scale :value="{ x: 0.01, y: 0.01, z: 0.01 }"/>
            <shadows cast receive/>

            <mesh model="PM_column">
              <shadows cast receive deep/>
            </mesh>
            <mesh model="PM_flat">
              <shadows cast receive deep/>
            </mesh>
          </group>

        </scene>

    </three>
  </div>
</div>
```

**Note**: The *OrbitBehaviour*, as well as the *StandardMaterial* components are not included in the library. You may however look them up in the samples if you wish.


#### Define custom materials

```html
<template>
  <material :factory="factory" :name="name"/>
</template>
```

```ts
import { MeshStandardMaterial, Texture } from "three";
import { Component, Prop, Vue } from "vue-property-decorator";

import { Application, components } from "../../../src";

const { Material } = components;

@Component({
  components: {
    Material
  }
})
export default class StandardMaterial extends Vue {
  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ type: String })
  public map!: string;

  @Prop({ type: String, default: "#ffffff" })
  public color!: string;

  @Prop({ type: Number, default: 0.01 })
  public metalness!: number;

  public async factory(app: Application) {
    let texture;
    if (this.map) {
      texture = await app.assets.textures.get(this.map);
    }

    const mat = new MeshStandardMaterial({
      color: this.color,
      metalness: this.metalness
    });
    mat.map = texture as Texture;
    return mat;
  }
}
```

**Note**: You can also create custom geometries in a very similar way with factory functions.

#### Define custom behaviours

```ts
import { Component, Mixins, Prop } from "vue-property-decorator";

import { BehaviourComponent } from "vue-threejs-composer";

@Component
export class HoverBehaviour extends Mixins(BehaviourComponent) {
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
    // access scene handler if behaviour is placed in a scene
    const scene = this.scene();
    // access object if behaviour is placed in an object
    const object = this.object();

    this.m_originalY = this.position.y;

    // once your component is ready
    this.ready();
  }

  // lifecycle function called on each frame (optional)
  public update(deltaTime: number) {
    this.position.y += deltaTime * (this.m_moveUp ? 1 : -1) * this.speed;

    const min = this.m_originalY - this.distance;
    const max = this.m_originalY + this.distance;
    if (this.position.y > max) {
      this.m_moveUp = false;
    } else if (this.position.y < min) {
      this.m_moveUp = true;
    }
  }

  public destroyed() {
    // dispose everything that needs to be disposed here
  }

  public render(h: any) {
    return h("div");
  }
}
```

## Documentation

As this module has only been recently released, there is no official documentation available yet.

For now, I added some samples to show how to use and implement your geometries, materials and prefabs.

If you have any questions, don't hesitate to open up a ticket.

## Bugs

The core features presented should be stable.
But as this module is still young, it will probably still have some bugs here and there.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) for details

## Acknowledgments

- Handling of multiple renderer inspired by [vue-gl](https://github.com/vue-gl/vue-gl)
