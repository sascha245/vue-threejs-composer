import * as THREE from "three";
import { VNode } from "vue";
import { Component, Mixins, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { AssetType } from "../types";
import { isThreeAssetComponent, ThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class Scene extends Mixins(ThreeComponent) {
  @Prop({ type: String, default: "" })
  public name!: string;

  @Provide("scene")
  private provideScene = this.getScene;

  private getScene() {
    return this.m_scene;
  }

  private m_isActive = false;
  private m_isReady = false;
  private m_scene?: THREE.Scene;

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
    // wait for preload components to load...
    await Vue.nextTick();

    // now preload
    await this.preloadAssets();
    this.app().sceneManager.set(this.name, this.m_scene);
    this.m_isReady = true;
  }

  public mounted() {
    const manager = this.app().sceneManager;
    manager.on("activate", this.onSceneActivate);
    manager.on("deactivate", this.onSceneDeactivate);
    this.watchName();
  }

  public beforeDestroy() {
    const manager = this.app().sceneManager;
    manager.off("activate", this.onSceneActivate);
    manager.off("deactivate", this.onSceneDeactivate);
    this.onDeactivate();
  }

  public render(h: any) {
    if (!this.m_isActive) {
      return null;
    }

    return h("div", [
      h("div", this.$slots.preload),
      h("div", this.m_isReady ? this.$slots.default : null)
    ]);
  }

  private async preloadAssets() {
    this.$emit("load");

    const data: { counter: number; assets: Array<Promise<AssetType>> } = {
      assets: [],
      counter: 0
    };
    this.recursivePreload(data, this.$slots.preload);

    await Promise.all(data.assets);
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

  private recursivePreload(
    data: { counter: number; assets: Array<Promise<AssetType>> },
    nodes: VNode[] | undefined
  ) {
    if (nodes) {
      for (const node of nodes) {
        const component = node.componentInstance;
        if (component && isThreeAssetComponent(component)) {
          const p = component.asset.then(asset => {
            ++data.counter;
            this.$emit("load-progress", data.counter, data.assets.length);
            return asset;
          });
          data.assets.push(p);
        }
        this.recursivePreload(data, node.children);
      }
    }
  }
}
