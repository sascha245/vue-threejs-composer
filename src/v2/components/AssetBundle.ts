import Vue, { VNode } from "vue";
import { Component, Mixins, Prop } from "vue-property-decorator";

import { BundleHandle } from "../core";
import { AppComponent, isAssetComponent } from "../mixins";
import { stringToArray } from "../utils/toArray";

@Component
export class AssetBundle extends Mixins(AppComponent) {
  @Prop({ type: String, required: true })
  public name!: string;

  @Prop({ type: Boolean, default: false })
  public preload!: boolean;

  @Prop({ type: [String, Array], default: () => [] })
  public dependencies!: string | string[];

  private m_active = false;
  private m_bundle!: BundleHandle;

  public mounted() {
    console.log("mounted asset bundle", this.name);
    this.m_bundle = this.app().assets.bundles.create(this.name);
    this.m_bundle.onLoad.on(this.onLoad);
    this.m_bundle.onUnload.on(this.onUnload);

    //TODO handle preload
  }

  public beforeDestroy() {
    this.app().assets.bundles.dispose(this.name);
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

    this.registerAssets(this.$slots.default);
  }

  private async onUnload(): Promise<void> {
    this.m_active = false;
    await Vue.nextTick();
  }

  private registerAssets(nodes: VNode[] | undefined) {
    if (nodes) {
      for (const node of nodes) {
        const component = node.componentInstance;
        if (component && isAssetComponent(component)) {
          this.m_bundle.registerAsset(component.asset);
        }
        this.registerAssets(node.children);
      }
    }
  }

  private getBundles(pDependencies: string | string[]): BundleHandle[] {
    const bundles: BundleHandle[] = [];
    const dependencies = stringToArray(",", pDependencies);
    const app = this.app();

    dependencies.forEach(name => {
      const bundle = app.assets.bundles.get(name);
      if (bundle) {
        bundles.push(bundle);
      }
    });
    return bundles;
  }
}
