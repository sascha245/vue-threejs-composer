# vue-threejs-composer

/!\ This module is still in development.

Build beautiful and interactive scenes in the easy way.

## Features

This library's strong points:

1. Core features to easily register assets and create objects in your scenes.

2. Asset manager to store your assets.

3. If necessary, easily create even the most unique geometries, materials and textures with dedicated factory functions.

4. Behaviours you can attach to objects, scenes or your application to move the world.

5. Inbuild input manager to handle inputs in a more forward way.

6. Scenes with asset preloading

7. Easily add your own content! It is very easy to create your own components and wrappers on top of this library.

**Todo:**

- Add cube texture component
- Add basic materials and geometries
- Add basic meshes and lights
- Add obj/fbx file loading and saving in asset manager

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
  <canvas ref="canvas" class="webglCanvas"></canvas>
  <div v-if="canvas">
    <three :canvas="canvas" antialias>

      <scene name="MyScene" active @load="loadingStarted" @load-progress="loadingProgress" @loaded="loadingFinished">
        <template slot="preload">
          
          <div>
            <material name="cubeMat" :factory="cubeMaterialFactory"/>
            <geometry name="cube" :factory="cubeFactory"/>
          </div>

          <material name="waterMat" :factory="waterMaterialFactory"/>
          <geometry name="plane" :factory="planeFactory"/>
        </template>

        <fog exp2/>
        <grid :size="10" :divisions="10"/>
        <axes :size="1"/>

        <camera name="mainCamera" :factory="cameraFactory">
          <position :value="camera.position"/>
          <rotation :value="camera.rotation" rad/>
        </camera>

        <light name="light" :factory="lightFactory">
          <position :value="light.position"/>
          <shadows cast/>

          <!-- See custom behaviour implementation below -->
          <hover-behaviour :position="light.position" :distance="1" :speed="5">
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
</div>
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
