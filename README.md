# Vue Three.js

/!\ This module is still in development.

Contains Vuejs bindings for creating and interacting with Threejs scenes and objects in a easy and reactive way.

**Features:**

Only core features will be present in this package: You will be able to extend this libraries classes and components to easily add your own required features.

However, for now, there are still some shipped in features. Some features are bound to change as the library evolves.

- Asset manager to automatically load and unload your assets.
- Custom asset factory functions to load (asynchronously) custom geometries, materials and textures.

- Scene manager able to handle multiple scenes. Only once scene at a time may be active however
- Meshes, cameras and lights and groups with reactive property bindings
- Behaviour components for data manipulation: Can be placed in the object, scene or application scope, depending on the seeked result.

- Other default components such as fog.

- First version of a input manager based on [pinput](https://github.com/ichub/pinput)

**Todo:**

- Remove scene active prop (can be done with an v-if attribute)

- Add cube texture component
- Add default materials and geometries

## Usage

###Installation

1. Install THREE.js:

`npm install three --save`

2. Optionally, install THREE.js typings:

`npm install @types/three --save-dev`

3. Install this package:

`npm install vue-threejs-composer --save`

###Samples

If you want to test out our samples, you can clone our repository and launch our samples with the following commands:

1. Install dependencies

`npm install`

2. Launch development server

`npm run serve`

3. Play around with the files in */samples*. The demo scene is situated at */samples/views/Demo.vue*

###Define your scenes

```html
<div>
    <canvas ref="canvas" class="webglCanvas"></canvas>
    <div v-if="canvas">
    <three :canvas="canvas" antialias>

      <scene name="MyScene" active>
        <template slot="preload">
          <material name="cubeMat" :factory="cubeMaterialFactory"/>
          <geometry name="cube" :factory="cubeFactory"/>

          <material name="waterMat" :factory="waterMaterialFactory"/>
          <geometry name="plane" :factory="planeFactory"/>
        </template>

        <camera name="mainCamera" :factory="cameraFactory">
          <position :value="scene1.camera.position"/>
          <rotation :value="scene1.camera.rotation" rad/>
        </camera>

        <light name="light" :factory="lightFactory">
          <position :value="{x: 0, y: 10, z: 0}"/>
          <shadows cast/>
        </light>

        <mesh name="waterPlane" geometry="plane" material="waterMat">
          <rotation :value="{ x: -90, y: 0, z: 0 }"/>
          <shadows receive/>
        </mesh>

        <mesh v-for="field in scene1.fields"
          :key="field.id"
          :name="'field-'+field.id"
          geometry="cube"
          material="cubeMat"
          >
          <position :value="{ x: field.x * 2, y: 0, z: field.y * 2}"/>
          <scale :value="{ x: 1.2, y: 0.7, z: 1.2}"/>
          <shadows cast receive/>
        </mesh>

      </scene>

    </three>
</div>
```

###Define custom behaviours

```ts
import { Component, Mixins, Prop } from "vue-property-decorator";

import { Behaviour } from "vue-threejs-composer";

@Component
export class MyBehaviour extends Mixins(Behaviour) {
  @Prop()
  public data!: {
    position: Vec3;
  };

  private m_moveUp = true;

  public created() {
    // access app
    const app = this.app();

    // access scene if behaviour is placed in a scene
    const scene = this.scene();

    // access object if behaviour is placed in an object
    const object = this.object();

    // once your component is ready
    this.ready();
  }

  // lifecycle function called before each frame (optional)
  public update(deltaTime: number) {
    const speed = 5; // 5 y / second
    this.data.position.y += deltaTime * (this.m_moveUp ? 1 : -1) * speed;

    if (this.data.position.y > 10) {
      this.m_moveUp = false;
    } else if (this.data.position.y < 0) {
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
