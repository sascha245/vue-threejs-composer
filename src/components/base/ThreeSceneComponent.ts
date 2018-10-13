import { Scene } from "three";
import { Component, Inject, Vue } from "vue-property-decorator";

@Component
export class ThreeSceneComponent extends Vue {
  @Inject({ default: undefined })
  protected scene!: () => Scene;
}
