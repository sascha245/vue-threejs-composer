<!--
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
``` -->
