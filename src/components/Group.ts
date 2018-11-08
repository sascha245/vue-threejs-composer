import * as THREE from "three";
import { Component, Mixins } from "vue-property-decorator";

import { Application } from "../core";
import { Entity } from "./Entity";

@Component
export class Group extends Mixins(Entity) {
  protected async instantiate(app: Application) {
    return new THREE.Group();
  }
}
