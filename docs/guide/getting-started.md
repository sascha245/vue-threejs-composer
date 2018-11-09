# Getting started

## Setup

Let's start out by creating a new component and setting up the base:

```html
<template>
  <div>
    <canvas ref="canvas"/>
    <Three v-if="canvas">

    </Three>
  </div>
</template>

<script>

import { components } from 'vue-threejs-composer'

export default {
  name: "ThreeApp",
  components: {
    ...components
  },
  data() {
    return {
      canvas: null
    }
  },
  mounted() {
    this.canvas = this.$ref.canvas;
  }
}
</script>

```
**Note**: The `Three` Component will be the root of our Three.js application.
Every element handling Three.js assets or objects are required to be placed in this component.


## Asset bundles

Now let's add a few assets we can use in our scenes. For that, we will use asset bundles to pack together our assets. You can create as many bundles as you need and also make your bundles depend on other bundles if you wish to.

```html
...
<Three v-if="canvas">

  <AssetBundle name="cube">
    <Material name="cube_Mat" :factory="cubeMaterialFactory"/>
    <Geometry name="cube_Geom" :factory="cubeGeometryFactory"/>
  </AssetBundle>

</Three>
...

<script>

import * as THREE from 'three'
...

export default {
  ...
  methods: {
    // you always need to return Promises from factory functions
    async cubeMaterialFactory() {
      return new THREE.MeshStandardMaterial({
        color: "#DDDDDD",
        metalness: 0.01
      });
    },
    async cubeGeometryFactory() {
      return new THREE.BoxBufferGeometry(1, 1, 1);
    }
  },
  ...
}

</script>
```

**Note**: The library will only contain the basic asset components, like `Material` and `Geometry`.
To see an example of how to create custom implementations on top of it, you can take a look [here](/guide/assets.html).


## Scene

Now that we created our assets, let's setup our scene:

```html
...
<Three v-if="canvas">

  <AssetBundle name="cube">
    <Material name="cube_Mat" :factory="cubeMaterialFactory"/>
    <Geometry name="cube_Geom" :factory="cubeGeometryFactory"/>
  </AssetBundle>

  <Scene name="scene1" assets="cube">

    <Camera name="main" :factory="perspectiveCameraFactory">
      <Position :value="{ x: -3.5, y: 1.75, z: 2.25 }"/>
      <Rotation :value="{ x: -41, y: -52, z: -35 }" />
    </Camera>

    <Light :factory="pointLightFactory">
      <Position :value="{ x: 0, y: 10, z: 5 }"/>
      <Shadows cast/>
    </Light>

    <Mesh material="cube_Mat" geometry="cube_Geom">
      <Position :value="{ x: 0, y: 0, z: 0 }"/>
      <Shadows cast receive/>
    </Mesh>

  </Scene>

</Three>
...
```

**Note**: To tell our scene to load our asset bundle, we simply specify the name of the bundle(s) in the *assets* property of `Scene`. To track the loading progress of our scene, you can add the following 3 event listeners:
- `@load` when the scene starts loading
- `@load-progress` each time when the scene finished loading a new asset
- `@loaded` when the scene finished loading

Now let's add the factory functions for our light and camera:

```js
...
export default {
  ...
  methods: {
    ...,
    async perspectiveCameraFactory() {
      const viewAngle = 60;
      const nearClipping = 0.1;
      const farClipping = 1000;
      return new THREE.PerspectiveCamera(
        viewAngle,
        window.innerWidth / window.innerHeight,
        nearClipping,
        farClipping
      );
    },
    async pointLightFactory() {
      return new THREE.PointLight(0xffffff, 1, 100);
    }
  },
  ...
}
```

With that, our scene should be setup.

## Renderer

Now we should already see.... a black screen?
In fact, this is quite normal, as we didn't include yet a very important component: the renderer!

```html
...
<Three v-if="canvas">
  ...
  <Renderer :canvas="canvas" camera="main" scene="scene1" :clearColor="0xCCCCCC" antialias shadows/>
  ...
</Three>
...
```

**Note**: Now the renderer will automatically look for a scene with the name *scene1*, as well as the camera the name *main* in it and load them.

You can also add multiple renderers if you wish.

Finally, we can see our cube before us:

![WebGl Cube](/webgl-cube.png)


## Textures

Now that we have our cube, let's add some texture on top of it.
We will have to do a few things:
- Load our texture in our asset bundle.
- Update our material factory function.

Here we go:

```html
<AssetBundle name="cube">
  <Texture name="crate_Texture" src="/assets/textures/crate.jpg"/>

  <!-- Load the texture before the material, or we won't be able to find the texture in the factory function -->
  <Material name="cube_Mat" :factory="cubeMaterialFactory"/>
  <Geometry name="cube_Geom" :factory="cubeGeometryFactory"/>
</AssetBundle>
```

That's it for the asset bundle. If you are using **vue-cli 3**, you can add your assets to the *./public* directory: In our case, we need to add the texture in *./public/assets/textures/crate.jpg*.

Now let's update our `cubeMaterialFactory` function.

```ts
...
async cubeMaterialFactory(app) {
  // Normally, you will throw some error in the case we didn't find the texture.
  const texture = await app.assets.textures.get('crate_Texture');

  const material = new THREE.MeshStandardMaterial({
    color: "#DDDDDD",
    metalness: 0.01
  });
  material.map = texture;
  return material;
}
```

That's it! Now you should see a cube with our texture.

![WebGl Cube with texture](/webgl-cube-texture.png)

