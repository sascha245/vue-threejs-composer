import { Component, Mixins, Prop } from "vue-property-decorator";

import { Behaviour } from "../../src";

@Component
export class HoverBehaviour extends Mixins(Behaviour) {
  @Prop({ required: true, type: Object })
  public position!: { y: number };

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
    const object = this.object!();

    this.m_originalY = this.position.y;

    // once your component is ready
    this.ready();
  }

  // lifecycle function called before each frame (optional)
  public update(deltaTime: number) {
    this.position.y += deltaTime * (this.m_moveUp ? 1 : -1) * this.speed;

    if (this.position.y > this.m_originalY + this.distance) {
      this.m_moveUp = false;
    } else if (this.position.y < this.m_originalY - this.distance) {
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
