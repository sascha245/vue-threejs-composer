import { Component, Mixins } from "vue-property-decorator";

import { ObjectComponent } from "./ObjectComponent";

interface BehaviourMethods {
  update?: (dt: number) => void;
}

@Component
export class BehaviourComponent extends Mixins(ObjectComponent) {
  public ready() {
    const app = this.app;
    const component = this as BehaviourMethods;
    if (component.update) {
      app.onUpdate.on(component.update);
    }
  }

  public beforeDestroy() {
    const app = this.app;
    const component = this as BehaviourMethods;
    if (component.update) {
      app.onUpdate.off(component.update);
    }
  }
}
