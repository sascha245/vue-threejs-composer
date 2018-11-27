# Getting started

## Setup

A THREE.js application is composed of multiple parts:

### `<Three>`

The `Three` Component will be the root of our Three.js application.
Every component of this library or that is extending this library is required to be placed in this component.

### `<Renderer>`

The `Renderer` Component is necessary for your application, as without it, nothing will be rendered in your canvas.
The renderer component included by default in this library requires multiple properties to work correctly:
- `canvas`: A canvas element
- `scene`: The name of the scene to load
- `camera`: The name of the camera to load

### `<AssetBundle>`

The `AssetBundle` Component groups up your assets in smaller parts. You will declare your assets in these bundles.

All assets in a bundle are loaded when a scene starts loading and the bundle is not already loaded.<br/>
All assets in a bundle are unloaded when no scene uses the bundle anymore.

This component requires a `name` property.

More information about assets can be found [here](/guide/assets.html)

### `<Scene>`

The `Scene` Component to define the content of our scene.

The components in the scene will only load when:
- the scene is at least in use by one renderer.
- all asset bundles marked with `preload` have been completely loaded.

This component requires a `name` property.

More information about scenes can be found [here](/guide/scenes.html)

### `<Camera>`

The `Camera` Component that will be used by the `Renderer` to render the scene. This component needs to be placed in a `Scene` Component.
This component requires a `name` property.


### General layout



```html
<template>
  <div>
    <canvas ref="canvas"/>
    <Three v-if="canvas">
      <Renderer :canvas="canvas" camera="main" scene="scene1" :clearColor="0xCCCCCC" antialias shadows/>

      <AssetBundle name="myBundle" preload>
        ...
      </AssetBundle>

      <Scene name="scene1" assets="myBundle" @load="..." @load-progress="..." @loaded="...">

        <Camera name="main">
          <Position :value="{x: 0, y: 0, z: 0}"/>
        </Camera>

        <!-- Declare scene objects -->
        ...
      </Scene>

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
    this.canvas = this.$refs.canvas;
  }
}
</script>

```




## Assets

Now let's add a few assets we can use in our scenes.


```html
...
<Three v-if="canvas">

  <AssetBundle name="cube" preload>
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


## Scene

Now that we created our assets, let's setup our scene with a point light, a cube and a camera pointing towards that cube.

```html
...
<Three v-if="canvas">

  ...

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

**Note**: To tell our scene to load our asset bundle, we simply specify the name of the bundle(s) in the `assets` property of `Scene`. To track the loading progress of our scene, you can add the following 4 event listeners:
- `@load` when the scene starts loading
- `@load-progress` each time when the scene finished loading a new asset
- `@loaded` when the scene finished loading
- `@unload` when the scene starts unloading

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
async cubeMaterialFactory(app: Application) {
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


## Models

Loading models involves a few more steps as for the textures above, but still stays relatively simple.
Here the steps to follow:
1. Register the extension with the appropriate loader
2. Load your model
3. Create a material to use by the model

Let's start by importing the FBXLoader:

```js
import FBXLoader from "three-fbxloader-offical";
import { Loader } from 'vue-threejs-composer'

Loader.register('fbx', FBXLoader);
```

You can use the package [three-fbxloader-offical](https://www.npmjs.com/package/three-fbxloader-offical) to include the FBXLoader. The spelling may be wrong but the package works fine.

**Note**: If you are using Typescript, you need to add a declaration file for this module:
```ts
// three-fbxloader-offical.d.ts
declare module "three-fbxloader-offical";
```

You can then load models with the *fbx* extension. If you wish to handle other extensions, you will also need to register those.

Now let's add a new asset bundle for our model, update the bundles used in our scene component and add a new mesh.

```html
...
<AssetBundle name="mixamo" preload>
  <Model name="Mixamo_YBot" src="/assets/models/ybot.fbx"/>
</AssetBundle>
...

<Scene name="scene1" assets="cube, mixamo">
  ...

  <Mesh name="ybot" model="Mixamo_YBot">
    <Position :value="{ x: 0, y: 0.5, z: 0 }"/>
    <Scale :value="{ x: 0.01, y: 0.01, z: 0.01}"/>
    <Shadows cast receive deep/>
  </Mesh>

</Scene>
```

With that, we should see a mixamo bot above our cube:

![WebGl Mixamo Bot](/webgl-mixamo-bot.png)

### Assigning materials to a model

If you want to override the materials used by the model by specifying the *materials* property.
You can also specify multiple materials separated by a comma, if the model has multiple meshes.

```html
<Model name="Mixamo_YBot" src="/assets/models/ybot.fbx" materials="myMaterial, mySecondMaterial"/>
```

**Note**: You have to define your materials before defining the model, or the model will not find the given materials.
