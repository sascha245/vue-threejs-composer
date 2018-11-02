import * as THREE from "three";
import { __await } from "tslib";
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

    // console.log("scene bundle unuse");

    await this.m_bundle.unuse();

    // console.log("scene bundle unloaded!");

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

    await Vue.nextTick();

    // now preload
    await this.preloadAssets();

    this.app().sceneManager.set(this.name, this.m_scene);
    this.m_isReady = true;
  }

  public mounted() {
    this.m_bundle = new AssetBundle();
    this.m_bundle.on("load", async () => {
      const bundles = this.getBundles(this.assets);
      // console.log("scene load bundles", bundles);
      await this.m_bundle.registerDependencies(bundles);
    });
    this.m_bundle.on("progress", (amount: number, total: number) => {
      // console.log("scene on progress", amount, total);
      this.$emit("load-progress", amount, total);
    });

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

    await this.m_bundle.use();
    // console.log("all bundles registrated");
    await this.m_bundle.isReady();

    // console.log("loaded!");
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
