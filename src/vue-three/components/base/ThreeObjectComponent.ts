import { Object3D } from "three";
import { Component, Inject, Vue } from "vue-property-decorator";

@Component
export class ThreeObjectComponent extends Vue {
  @Inject({ default: undefined })
  protected object!: (() => Object3D) | undefined;
}
