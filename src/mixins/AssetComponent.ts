import { Component, Inject, Mixins, Vue } from "vue-property-decorator";

import { BundleHandle } from "../core";
import { AppComponent } from "./AppComponent";

export type BundleGetter = () => BundleHandle | undefined;

const BundleDefaultGetter = () => undefined;

@Component
export class AssetComponent extends Mixins(AppComponent) {
  @Inject({ default: BundleDefaultGetter })
  protected bundle!: BundleGetter;
}
