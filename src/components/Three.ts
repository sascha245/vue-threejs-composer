import { CreateElement } from "vue";
import { Component, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { Application } from "../core";
import { Provider } from "../utils/provider";

@Component
export class Three extends Vue {
  @Prop({ default: true, type: Boolean })
  public active!: boolean;

  @Provide()
  public app = Provider.defaultValue<Application>();

  private m_ready = false;
  private m_app!: Application;

  public mounted() {
    this.m_app = new Application();
    Provider.setValue<Application>(this.app, this.m_app);
    this.onChangeActive();
    this.m_ready = true;
  }

  public destroyed() {
    this.onDeactivate();
    if (this.m_app) {
      this.m_app.dispose();
    }
  }

  @Watch("active")
  public onChangeActive() {
    if (this.active) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  public onDeactivate() {
    this.m_app.deactivate();
  }
  public onActivate() {
    this.m_app.activate();
  }

  public render(h: CreateElement) {
    if (!this.m_ready) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
