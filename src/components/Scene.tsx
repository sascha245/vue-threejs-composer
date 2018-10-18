import * as THREE from "three";
import { VNode } from "vue";
import { Component, Mixins, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { AssetType } from "../types";
import { isThreeAssetComponent, ThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class Scene extends Mixins(ThreeComponent) {
  @Prop({ type: String, default: "" })
  public name!: string;

  @Prop({ default: false, type: Boolean })
  public active!: boolean;

  @Provide("scene")
  public provideScene = this.getScene;

  private m_isReady = false;
  private m_isActive = false;
  private m_scene?: THREE.Scene;

  public getScene() {
    return this.m_scene;
  }

  @Watch("active")
  public async onChangeActive() {
    const manager = this.app().sceneManager;

    if (this.active) {
      await Vue.nextTick();
    }

    this.m_isActive =
      manager.active && manager.active !== this.m_scene ? false : this.active;
    if (this.m_isActive !== this.active) {
      this.$emit("update:active", this.m_isActive);
    }
    if (this.m_isActive) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  public async onDeactivate() {
    const manager = this.app().sceneManager;
    if (this.m_scene === manager.active) {
      manager.active = undefined;
    }
    this.m_isReady = false;

    await Vue.nextTick();

    this.m_scene = undefined;
  }

  public async onActivate() {
    const manager = this.app().sceneManager;
    this.m_scene = new THREE.Scene();
    this.m_scene.name = this.name;
    manager.active = this.m_scene;

    await Vue.nextTick();
    await this.preloadAssets();

    this.m_isReady = true;
  }

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

  public async preloadAssets() {
    this.$emit("load");

    const data: { counter: number; assets: Array<Promise<AssetType>> } = {
      assets: [],
      counter: 0
    };
    this.recursivePreload(data, this.$slots.preload);

    await Promise.all(data.assets);
    this.$emit("loaded");
  }

  public mounted() {
    this.onChangeActive();
  }

  public beforeDestroy() {
    this.onDeactivate();
  }

  public render(h: any) {
    if (!this.m_isActive) {
      return null;
    }

    return (
      <div>
        <div>{this.$slots.preload}</div>
        <div>{this.m_isReady ? this.$slots.default : null}</div>
      </div>
    );
  }
}
