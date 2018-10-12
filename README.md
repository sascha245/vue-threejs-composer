# Vue Three.js

/!\ This module is still in development and not usable yet as a library.

Contains Vuejs bindings for creating and interacting with Threejs scenes and objects in a easy and reactive way.

**Features:**

- Only core features will be present in this package
- Asset manager with preload possibility (loading events not done yet)
- Scene manager with scene switching / loading
- Reactive meshes, cameras and lights
- Asynchronous asset and mesh loading
- Custom factory functions to load (asynchronously) custom geometries, materials and textures
- Input manager
- Behaviour components for data manipulation

**Todo:**

- Add delta time ( for now it is equals to 0 all time )
- Change project to library and add samples
- Publish first pre-release on npm

## Usage

####Define your scenes

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

####Define custom behaviours

```ts
import { Component, Mixins, Prop } from "vue-property-decorator";

import { Behaviour } from "vue-threejs-composer";

@Component
export class MyBehaviour extends Mixins(Behaviour) {
  @Prop()
  public data!: {
    position: Vec3;
    rotation: Vec3;
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
    this.data.position.y += 0.01 * (this.m_moveUp ? 1 : -1);

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
