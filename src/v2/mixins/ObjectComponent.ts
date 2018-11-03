import { Object3D } from "three";
import { Component, Inject, Mixins } from "vue-property-decorator";

import { SceneComponent } from "./SceneComponent";

export type ObjectGetter = () => Object3D | undefined;

const ObjectDefaultGetter = () => undefined;

@Component
export class ObjectComponent extends Mixins(SceneComponent) {
  @Inject({ default: ObjectDefaultGetter })
  protected object!: ObjectGetter;
}
