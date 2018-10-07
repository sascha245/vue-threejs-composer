import Vue from "vue";
import { Inject } from "vue-property-decorator";

import { ThreeApplication } from "./ThreeApplication";

export abstract class ThreeComponent extends Vue {
  @Inject()
  protected app!: () => ThreeApplication;
}
