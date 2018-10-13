import { Component, Inject, Vue } from "vue-property-decorator";

import { Application } from "../../core";

@Component
export class ThreeComponent extends Vue {
  @Inject()
  protected app!: () => Application;
}
