import { Component, Inject, Mixins } from "vue-property-decorator";

import { SceneHandle } from "../core";
import { AppComponent } from "./AppComponent";

export type SceneGetter = () => SceneHandle | undefined;

const SceneDefaultGetter = () => undefined;

@Component
export class SceneComponent extends Mixins(AppComponent) {
  @Inject({ default: SceneDefaultGetter })
  protected scene!: SceneGetter;
}
