import { Component, Inject, Vue } from "vue-property-decorator";

import { Application } from "../core";

export type AppGetter = () => Application;

@Component
export class AppComponent extends Vue {
  @Inject()
  protected app!: AppGetter;
}
