import { Component, Inject, Mixins } from "vue-property-decorator";

import { BundleHandle } from "../core";
import { Provider, ProviderValue } from "../utils/provider";
import { AppComponent } from "./AppComponent";

@Component
export class AssetComponent extends Mixins(AppComponent) {
  @Inject({
    from: "bundle",
    default: Provider.defaultValue<BundleHandle>()
  })
  private injectedBundle!: ProviderValue<BundleHandle>;

  protected get bundle() {
    return this.injectedBundle.value;
  }
}
