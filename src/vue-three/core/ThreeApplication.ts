import * as THREE from "three";

import { AssetManager } from "../core/AssetManager";
import { CameraManager } from "../core/CameraManager";
import { SceneManager } from "../core/SceneManager";

export class ThreeApplication {
  public assets: AssetManager;
  public inputs = {};
  public renderer: THREE.WebGLRenderer;
  public sceneManager: SceneManager;
  public cameraManager: CameraManager;

  public disposed = false;

  constructor(rendererOptions: THREE.WebGLRendererParameters) {
    this.assets = new AssetManager();
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

  public update(deltaTime: number) {
    const scene = this.sceneManager.active;
    const camera = this.cameraManager.main;
    if (this.renderer) {
      this.renderer.clearColor();

      if (scene && camera) {
        this.renderer.render(scene, camera);
      }
    }
  }
}
