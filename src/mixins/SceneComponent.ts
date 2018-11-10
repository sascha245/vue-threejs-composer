import { Component, Inject, Mixins } from "vue-property-decorator";

import { SceneHandle } from "../core";
import { ProviderValue } from "../utils/provider";
import { AppComponent } from "./AppComponent";

@Component
export class SceneComponent extends Mixins(AppComponent) {
  @Inject("scene")
  private injectedScene!: ProviderValue<SceneHandle>;

  protected get scene() {
    return this.injectedScene.value;
  }
}
