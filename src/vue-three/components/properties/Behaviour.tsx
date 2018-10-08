import { Component, Inject, Prop, Vue } from "vue-property-decorator";

import { ThreeApplication } from "../../core";
import { BehaviourScript } from "../../core/BehaviourScript";

@Component
export class Behaviour extends Vue {
  @Inject()
  private app!: () => ThreeApplication;

  @Prop({
    required: true,
    type: Function
  })
  private value!: { new (): BehaviourScript };

  @Prop()
  private data!: any;

  private m_instance!: BehaviourScript;

  public created() {
    this.m_instance = new this.value();
    const isBehaviourScript = this.m_instance instanceof BehaviourScript;
    if (!isBehaviourScript) {
      throw new Error(
        "Invalid value passed to Behaviour: instance of value is not of type BehaviourScript"
      );
    }

    this.m_instance.onInitialize(this.app(), this.data);
    this.app().on("update", this.onUpdate);
  }

  public onUpdate(deltaTime: number) {
    this.m_instance.onUpdate(deltaTime);
  }

  public beforeDestroy() {
    this.app().off("update", this.onUpdate);
    this.m_instance.onDestroy();
  }

  public render(h: any) {
    return <div className="behaviour">Behaviour</div>;
  }
}
