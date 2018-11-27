# Assets

Assets are an essential part of our application, as they allow us to define our textures, materials, geometries and models.

## Bundles

To better organize and load those assets in our scenes, we put them in named bundles. Those bundles can contain a multitude of assets.

```html
...
<Three>

  <AssetBundle name="cube" preload>
    <Material name="cube_Mat" :factory="cubeMaterialFactory"/>
    <Geometry name="cube_Geom" :factory="cubeGeometryFactory"/>
  </AssetBundle>

</Three>
...
```

The library by default only includes basic asset components, like `Material`, `Geometry`, `Texture` and `Model`.

## Factories

For each of these components, you can pass them a factory function to tell the component how to create the corresponding asset:

```js
import * as THREE from 'three'
...

export default {
  ...
  methods: {
    // you always need to return Promises from factory functions
    async cubeMaterialFactory(app: Application) {
      return new THREE.MeshStandardMaterial({
        color: "#DDDDDD",
        metalness: 0.01
      });
    },
    async cubeGeometryFactory(app: Application) {
      return new THREE.BoxBufferGeometry(1, 1, 1);
    }
  },
  ...
}
```

## Extending components

You can also extend those basic asset components to create custom components:

```js
import * as THREE from 'three'
import { components } from 'vue-threejs-composer'

export default {
  name: 'StandardMaterial',
  mixins: [
    components.Material
  ],
  props: [
    {
      name: 'color',
      default: '#000000',
      type: String
    },
    {
      name: 'metalness',
      default: 0.01,
      type: Number
    }
  ],
  methods: {
    async instantiate() {
      return new THREE.MeshStandardMaterial({
        color: this.color,
        metalness: this.metalness
      });
    }
  }
}
```

::: tip NOTE
The same is possible with `Geometry`, `Texture` and `Model`
:::

## Loader

To add custom asset loaders, as for example FBXLoader, you need to register the loader to a corresponding extension in the `Loader` class provided by *vue-threejs-composer*:

```ts
import FBXLoader from "three-fbxloader-offical";
import { Loader } from 'vue-threejs-composer'

Loader.register('fbx', FBXLoader);
```

## Dependencies

### Scene dependencies

To make your scenes aware about which asset bundles it should load when the scene is activated, you can specify your bundles in the `assets` property of the scene.

The `assets` property can be either a string (multiple entries are separated by comma) or an array of strings with the name of the bundles.

**Note**:
- All assets in the specified bundles are first registered: the assets promises are added to the asset manager, but haven't finished loading yet.
- The scene will only wait until all assets whose asset bundles are marked with `preload` are loaded.

```html
...
<AssetBundle name="basic_geometries" preload>
  <Geometry name="cube" :factory="cubeFactory" />
  <Geometry name="plane" :factory="planeFactory" />
  <Geometry name="sphere" :factory="sphereFactory" />
  ...
</AssetBundle>

<AssetBundle name="my_assets" preload>
  <Material name="cube_Mat" :factory="cubeMaterialFactory"/>
</AssetBundle>

<!-- Scene will register for assets from basic_geometries and my_assets -->
<!-- As basic_geometries and my_assets have the preload property, scene will wait until both are loaded -->
<Scene name="scene1" assets="basic_geometries, my_assets">...</Scene>
<Scene name="scene2" :assets="['basic_geometries', 'my_assets']">...</Scene>

```

### Bundle dependencies

If your asset bundle depends on assets registered in other bundles, you can specify these bundles in the `dependencies` property of your asset bundle.

As with the `assets` property of `Scene`, the `dependencies` property can be either a string (multiple entries are separated by comma) or an array of strings with the name of the bundles.

**Note**:
- The bundle won't wait until they are fully loaded before registering his own assets.
- When the scene starts loading, all the bundle's `dependencies` are also registered.

**Warning**: As always, the scene will only wait until bundles with `preload` are completely loaded.

```html
...
<AssetBundle name="my_assets1">
  <Geometry name="cube" :factory="cubeFactory" />
  <Geometry name="plane" :factory="planeFactory" />
  <Geometry name="sphere" :factory="sphereFactory" />
  ...
</AssetBundle>

<AssetBundle name="my_assets2" dependencies="my_assets1" preload>
  <Material name="cube_Mat" :factory="cubeMaterialFactory"/>
</AssetBundle>

<!-- Scene will register assets from my_assets2 and my_assets1 -->
<!-- Scene will however only wait until my_assets2 is completely loaded (my_assets1 has no preload property set to true) -->
<Scene name="scene1" assets="my_assets2">...</Scene>

```

## Usage

You can access the asset manager, and so all registered assets, from the `Application` class instance that is passed to all factory functions.

When extending asset components, you can access the Application instance with `this.app`

In the asset manager, following properties can be accessed:
- textures
- geometries
- materials
- models

Each instance / property, inheriting from `AssetMap`, has:
- a getter function `get(assetName: string)`
- a setter function `set(assetName: string, asset: AssetType)`
- a dispose function `dispose()`

**Warning:** Most of the time, you will only use the `get` function, as the implemented asset components already set and dispose assets automatically for you.
