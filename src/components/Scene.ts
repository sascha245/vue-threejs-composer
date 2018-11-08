import { Scene as ThreeScene } from "three";
import { Component, Mixins, Prop, Provide, Vue } from "vue-property-decorator";

import { BundleHandle, SceneHandle } from "../core";
import { AppComponent } from "../mixins";
import { Provider } from "../utils/provider";
import { stringToArray } from "../utils/toArray";

@Component
export class Scene extends Mixins(AppComponent) {
  @Prop({ type: String, required: true })
  public name!: string;

  @Prop({ type: [String, Array], default: () => [] })
  public assets!: string | string[];

  @Provide("scene")
  private provideScene = Provider.defaultValue<SceneHandle>();

  private m_active = false;
  private m_scene!: SceneHandle;

  public async onLoad() {
    this.$emit("load");
    await this.m_scene.registerDependencies(this.bundles());
  }
  public async onLoadProgress(amount: number, total: number) {
    this.$emit("load-progress", amount, total);
  }
  public async onActivate() {
    const scene = new ThreeScene();
    scene.name = this.name;
    this.m_scene.set(scene);
    this.m_active = true;
    await Vue.nextTick();
    this.$emit("loaded");
  }
  public async onUnload() {
    this.m_active = false;
    await Vue.nextTick();
    this.m_scene.set(undefined);
  }

  public mounted() {
    this.m_scene = this.app.scenes.create(this.name);
    this.m_scene.onLoad.on(this.onLoad);
    this.m_scene.onActivate.on(this.onActivate);
    this.m_scene.onUnload.on(this.onUnload);
    this.m_scene.onLoadProgress.on(this.onLoadProgress);

    Provider.setValue<SceneHandle>(this.provideScene, this.m_scene);
  }

  public destroyed() {
    this.app.scenes.dispose(this.name);
  }

  public render(h: any) {
    if (!this.m_active) {
      return null;
    }
    return h("div", this.$slots.default);
  }

  public bundles() {
    const bundles: BundleHandle[] = [];
    const app = this.app;
    const dependencies = stringToArray(",", this.assets);
    dependencies.forEach(dep => {
      const bundle = app.assets.bundles.get(dep);
      if (bundle) {
        bundles.push(bundle);
      }
    });
    return bundles;
  }
}
