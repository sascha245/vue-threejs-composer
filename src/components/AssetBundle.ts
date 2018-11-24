import { Component, Mixins, Prop, Provide, Vue } from "vue-property-decorator";

import { BundleHandle } from "../core";
import { AppComponent } from "../mixins";
import { Provider } from "../utils/provider";
import { stringToArray } from "../utils/toArray";

@Component
export class AssetBundle extends Mixins(AppComponent) {
  @Prop({ type: String, required: true })
  public name!: string;

  @Prop({ type: Boolean, default: false })
  public preload!: boolean;

  @Prop({ type: Number, default: 0 })
  public timeout!: number;

  @Prop({ type: [String, Array], default: () => [] })
  public dependencies!: string | string[];

  @Provide("bundle")
  private provideBundle = Provider.defaultValue<BundleHandle>();

  private getBundle() {
    return this.m_bundle;
  }

  private m_active = false;
  private m_bundle!: BundleHandle;

  public mounted() {
    this.m_bundle = this.app.assets.bundles.create(this.name);
    this.m_bundle.onLoad.on(this.onLoad);
    this.m_bundle.onUnload.on(this.onUnload);
    this.m_bundle.preload = this.preload;
    this.m_bundle.unloadTimeout = this.timeout;

    Provider.setValue(this.provideBundle, this.m_bundle);
  }

  public destroyed() {
    this.app.assets.bundles.dispose(this.name);
  }

  public render(h: any) {
    if (!this.m_active) {
      return null;
    }
    return h("div", this.$slots.default);
  }

  private async onLoad(): Promise<void> {
    this.m_active = true;

    const bundles = this.getBundles(this.dependencies);
    const deps = this.m_bundle.registerDependencies(bundles);

    await Vue.nextTick();
    await deps;
  }

  private async onUnload(): Promise<void> {
    this.m_active = false;
    await Vue.nextTick();
  }

  private getBundles(pDependencies: string | string[]): BundleHandle[] {
    const bundles: BundleHandle[] = [];
    const dependencies = stringToArray(",", pDependencies);
    const app = this.app;

    dependencies.forEach(name => {
      const bundle = app.assets.bundles.get(name);
      if (bundle) {
        bundles.push(bundle);
      }
    });
    return bundles;
  }
}
