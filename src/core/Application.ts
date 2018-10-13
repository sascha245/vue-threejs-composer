import { EventEmitter } from "events";
import * as THREE from "three";

import { AssetManager } from "../core/AssetManager";
import { CameraManager } from "../core/CameraManager";
import { InputManager } from "../core/InputManager";
import { SceneManager } from "../core/SceneManager";

export type ApplicationHook = "update";

export class Application {
  public assets: AssetManager;
  public inputs: InputManager;
  public renderer: THREE.WebGLRenderer;
  public sceneManager: SceneManager;
  public cameraManager: CameraManager;

  public disposed = false;

  private _hooks: EventEmitter;

  constructor(rendererOptions: THREE.WebGLRendererParameters) {
    this._hooks = new EventEmitter();

    this.assets = new AssetManager();
    this.inputs = new InputManager();
    this.sceneManager = new SceneManager();
    this.cameraManager = new CameraManager();
    this.renderer = new THREE.WebGLRenderer(rendererOptions);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    // this.renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

    this.renderer.setClearColor(new THREE.Color("#dddddd"));
  }

  public dispose() {
    this.renderer.dispose();
    this.inputs.dispose();
    this.disposed = true;
  }

  public setSize(width: number, height: number) {
    const camera = this.cameraManager.main;
    if (camera) {
      // if (camera instanceof THREE.PerspectiveCamera) {
      //   camera.aspect = width / height;
      //   camera.updateProjectionMatrix();
      // }
    }
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
  }

  public on(type: ApplicationHook, fn: (...args: any[]) => void) {
    this._hooks.on(type, fn);
  }
  public off(type: ApplicationHook, fn: (...args: any[]) => void) {
    this._hooks.removeListener(type, fn);
  }

  public update(deltaTime: number) {
    const scene = this.sceneManager.active;
    const camera = this.cameraManager.main;
    if (this.renderer) {
      this.renderer.clearColor();
      this.inputs.update();

      this._hooks.emit("update", deltaTime);

      if (scene && camera) {
        this.renderer.render(scene, camera);
      }
    }
  }
}
