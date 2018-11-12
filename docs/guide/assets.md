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

## Dependencies

## Dynamic assets

## Usage


