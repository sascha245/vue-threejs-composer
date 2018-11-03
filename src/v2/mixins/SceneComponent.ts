import { Scene } from "three";
import { Component, Inject, Mixins } from "vue-property-decorator";

import { AppComponent } from "./AppComponent";

export type SceneGetter = () => Scene | undefined;

const SceneDefaultGetter = () => undefined;

@Component
export class SceneComponent extends Mixins(AppComponent) {
  @Inject({ default: SceneDefaultGetter })
  protected scene!: SceneGetter;
}
