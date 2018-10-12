import { Component, Mixins } from "vue-property-decorator";

import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";

@Component
export class Property extends Mixins(
  ThreeComponent,
  ThreeSceneComponent,
  ThreeObjectComponent
) {}
