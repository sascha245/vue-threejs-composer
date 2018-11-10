import { Component, Inject, Vue } from "vue-property-decorator";

import { Application } from "../core";
import { ProviderValue } from "../utils/provider";

@Component
export class AppComponent extends Vue {
  @Inject("app")
  private injectedApp!: ProviderValue<Application>;

  protected get app() {
    return this.injectedApp.value!;
  }
}
