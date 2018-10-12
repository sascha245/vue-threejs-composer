import * as THREE from "three";
import { Component, Mixins, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { AssetType } from "../types";
import { ThreeAssetComponent, ThreeComponent } from "./base";

@Component
export class Scene extends Mixins(ThreeComponent) {
  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ default: false, type: Boolean })
  public active!: boolean;

  @Provide("scene")
  public provideScene = this.scene;

  private m_isReady = false;
  private m_isActive = false;
  private m_scene?: THREE.Scene;

  public scene() {
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

  public onDeactivate() {
    console.log("deactivate scene", this.name);

    const manager = this.app().sceneManager;
    if (this.m_scene === manager.active) {
      manager.active = undefined;
    }
    this.m_scene = undefined;
    this.m_isReady = false;
  }

  public async onActivate() {
    console.log("activate scene", this.name);

    const manager = this.app().sceneManager;
    this.m_scene = new THREE.Scene();
    manager.active = this.m_scene;

    await Vue.nextTick();
    await this.preloadAssets();

    this.m_isReady = true;
  }

  public async preloadAssets() {
    const assets: Array<Promise<AssetType>> = [];
    const preloadNodes = this.$slots.preload;
    if (preloadNodes) {
      for (const node of preloadNodes) {
        const component = node.componentInstance;
        if (component instanceof ThreeAssetComponent) {
          assets.push(component.asset);
        }
      }
    }

    return Promise.all(assets);
  }

  public mounted() {
    console.log("scene mounted");
    this.onChangeActive();
  }

  public beforeDestroy() {
    console.log("scene beforeDestroy");
    this.onDeactivate();
  }

  public render(h: any) {
    console.log("scene render");
    if (!this.m_isActive) {
      return null;
    }

    const whenReady = (
      <div>
        <h3>Scene ready</h3>
        {this.$slots.default}
      </div>
    );

    return (
      <div className="scene">
        <h2>Scene {this.name}</h2>
        <div>
          <h3>Preload</h3>
          {this.$slots.preload}
        </div>
        {this.m_isReady ? whenReady : null}
      </div>
    );
  }
}
