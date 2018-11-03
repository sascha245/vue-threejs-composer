import { Component, Mixins, Vue } from "vue-property-decorator";

import { AssetType } from "../core";
import { AppComponent } from "./AppComponent";

@Component
export class AssetComponent extends Mixins(AppComponent) {
  public asset!: Promise<AssetType>;
}

export function isAssetComponent(component: Vue): component is AssetComponent {
  return (component as any).asset instanceof Promise;
}
