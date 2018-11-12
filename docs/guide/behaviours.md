# Behaviours

Behaviours are scripts that can be attached to an object, a scene or directly to your application.
In those components, you can add an `update` method that will be called on each tick before render.

You can use those components to easily add some logic

```html
...
<Three>
  <!-- Application scoped -->
  <my-behaviour message="Application scoped"/>

  <Scene name="my-scene">

    <!-- Scene scoped -->
    <my-behaviour message="Scene scoped"/>

    <Mesh>
      <!-- Object scoped -->
      <my-behaviour message="Object scoped"/>
    </Mesh>
  </Scene>
</Three>
...
```

```js
import { BehaviourComponent } from 'vue-threejs-composer'

export default {
  name: 'MyBehaviour',
  mixins: [
    BehaviourComponent
  ],
  props: [
    {
      name: 'message',
      required: true;
      type: String
    }
  ],
  methods: {
    async start() {

      this.app // Application
      this.scene // SceneHandle | undefined
      this.object // Object3D | Camera | undefined

      // it will only start calling update once start resolved
    },
    update(dt: number) {

    },
    destroy() {

    }
  }
}

```
