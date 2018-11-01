import Vue, { VNode } from "vue";
import { Component, Mixins, Prop } from "vue-property-decorator";

import { AssetBundle as Bundle } from "../core";
import { isThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class AssetBundle extends Mixins(ThreeComponent) {
  @Prop({ type: String, default: "" })
  public name!: string;

  @Prop({ type: Boolean, default: false })
  public preload!: boolean;

  @Prop({ type: [String, Array], default: () => [] })
  public dependencies!: string | string[];

  private m_isActive = false;
  private m_bundle!: Bundle;

  public mounted() {
    const manager = this.app().assets;
    this.m_bundle = manager.createBundle(this.name);
    this.m_bundle.onload = this.onLoadBundle;
    this.m_bundle.onunload = this.onUnloadBundle;
    // TODO handle preload on / off
    // this.m_bundle.preload = this.preload;
  }

  public beforeDestroy() {
    const manager = this.app().assets;
    manager.deleteBundle(this.name);
  }

  public render(h: any) {
    if (!this.m_isActive) {
      return null;
    }
    return h("div", this.$slots.default);
  }

  private async onLoadBundle(): Promise<void> {
    this.m_isActive = true;

    const bundles = this.getBundles(this.dependencies);
    const deps = this.m_bundle.registerDependencies(bundles);

    await Vue.nextTick();
    await deps;

    console.log("load assets for bundle ", this.name);

    this.registerAssets(this.$slots.default);
  }

  private async onUnloadBundle() {
    this.m_isActive = false;
  }

  private registerAssets(nodes: VNode[] | undefined) {
    if (nodes) {
      for (const node of nodes) {
        const component = node.componentInstance;
        if (component && isThreeAssetComponent(component)) {
          this.m_bundle.registerAsset(component.asset);
        }
        this.registerAssets(node.children);
      }
    }
  }

  private getBundles(dependencies: string | string[]): Bundle[] {
    const manager = this.app().assets;
    const bundles: Bundle[] = [];

    if (!dependencies) {
      return bundles;
    }
    if (typeof dependencies === "string") {
      dependencies = dependencies.split(",").map(mat => mat.trim());
    }
    if (!Array.isArray(dependencies)) {
      throw new Error(
        `AssetBundle "${
          this.name
        }" could not be loaded: "dependencies" have to be either a string or an array`
      );
    }
    (dependencies as string[]).forEach(dep => {
      const bundle = manager.getBundle(dep);
      if (bundle) {
        bundles.push(bundle);
      }
    });
    return bundles;
  }
}
