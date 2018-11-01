import * as THREE from "three";
import { VNode } from "vue";
import { Component, Mixins, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { AssetBundle } from "../core";
import { AssetType, OnLoadAssetBundleData } from "../types";
import { isThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class Scene extends Mixins(ThreeComponent) {
  @Prop({ type: String, default: "" })
  public name!: string;

  @Prop({ type: [String, Array], default: () => [] })
  public assets!: string | string[];

  @Provide("scene")
  private provideScene = this.getScene;

  private getScene() {
    return this.m_scene;
  }

  private m_isActive = false;
  private m_isReady = false;
  private m_scene?: THREE.Scene;
  private m_bundle!: AssetBundle;

  @Watch("name")
  private watchName() {
    if (this.m_scene) {
      this.onDeactivate();
    }
    const isActive = this.app().sceneManager.isUsed(this.name);
    if (isActive) {
      this.onActivate();
    }
  }

  public async onDeactivate() {
    // deactive children
    this.m_isReady = false;

    console.log("scene bundle unuse");

    await this.m_bundle.unuse();
    await Vue.nextTick();

    if (this.m_scene) {
      this.app().sceneManager.remove(this.m_scene.name);
    }

    this.m_isActive = false;
    this.m_scene = undefined;
  }

  public async onActivate() {
    this.m_scene = new THREE.Scene();
    this.m_scene.name = this.name;

    // tell the component to render the component (see render)
    this.m_isActive = true;

    // now preload
    await this.preloadAssets();
    this.app().sceneManager.set(this.name, this.m_scene);
    this.m_isReady = true;
  }

  public mounted() {
    this.m_bundle = new AssetBundle(this.app());
    this.m_bundle.onload = async () => {
      const bundles = this.getBundles(this.assets);
      console.log("scene load bundles", bundles);
      await this.m_bundle.registerDependencies(bundles);
    };

    const manager = this.app().sceneManager;
    manager.on("activate", this.onSceneActivate);
    manager.on("deactivate", this.onSceneDeactivate);
    this.watchName();
  }

  public beforeDestroy() {
    this.m_bundle.unuse();

    const manager = this.app().sceneManager;
    manager.off("activate", this.onSceneActivate);
    manager.off("deactivate", this.onSceneDeactivate);
    this.onDeactivate();
  }

  public render(h: any) {
    if (!this.m_isActive || !this.m_isReady) {
      return null;
    }

    return h("div", this.$slots.default);
  }

  private async preloadAssets() {
    this.$emit("load");

    const data = {
      count: 0,
      amount: 0
    };

    const progressListener = () => {
      ++data.amount;
      console.log(data.amount, data.count);
      this.$emit("load-progress", data.amount, data.count);
    };

    await this.m_bundle.use(progressListener);

    // we can now count assets to be loaded..
    data.count = AssetBundle.countAssets([this.m_bundle]);

    console.log("count", data.count);

    await this.m_bundle.isReady();

    console.log("loaded!");
    this.$emit("loaded");
  }

  private onSceneActivate = (sceneName: string) => {
    if (sceneName !== this.name) {
      return;
    }
    this.onActivate();
  };
  private onSceneDeactivate = (sceneName: string) => {
    if (sceneName !== this.name) {
      return;
    }
    this.onDeactivate();
  };

  private getBundles(dependencies: string | string[]): AssetBundle[] {
    const manager = this.app().assets;
    const bundles: AssetBundle[] = [];

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
