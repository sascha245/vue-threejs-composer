import { EventEmitter } from "events";
import { Camera, Scene, WebGLRenderer, WebGLRendererParameters } from "three";

import { Application } from "./Application";

export type RenderCallback = () => void;

export class RendererHandler {
  private _app: Application;
  private _renderer: WebGLRenderer;
  private _scene?: Scene;
  private _camera?: Camera;

  private _sceneName?: string;
  private _cameraName?: string;
  private _renderCallback?: RenderCallback;
  private _onSceneChangeCallbacks = new EventEmitter();
  private _onCameraChangeCallbacks = new EventEmitter();

  public get renderer() {
    return this._renderer;
  }
  public get scene() {
    return this._scene;
  }
  public get camera() {
    return this._camera;
  }

  public constructor(app: Application, options?: WebGLRendererParameters) {
    this._app = app;
    this._renderer = new WebGLRenderer(options);

    this._app.sceneManager.on("change", this.handleSceneChange);
    this._app.cameraManager.on("change", this.handleCameraChange);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  public dispose() {
    window.removeEventListener("resize", this.handleResize);
    this._app.sceneManager.off("change", this.handleSceneChange);
    this._app.cameraManager.off("change", this.handleCameraChange);
  }

  public setSceneName(name?: string) {
    if (this._sceneName === name) {
      return;
    }
    if (this._sceneName) {
      this._app.sceneManager.unuse(this._sceneName);
    }
    this._scene = undefined;
    if (name) {
      this._app.sceneManager.use(name);
      this._scene = this._app.sceneManager.get(name);
    }
    this._sceneName = name;
    this._onSceneChangeCallbacks.emit("change", this._scene);
  }
  public setCameraName(name?: string) {
    if (this._cameraName === name) {
      return;
    }
    if (this._cameraName) {
      this._app.cameraManager.unuse(this._cameraName);
    }
    this._camera = undefined;
    if (name) {
      this._app.cameraManager.use(name);
      this._camera = this._app.cameraManager.get(name);
    }
    this._cameraName = name;
    this._onCameraChangeCallbacks.emit("change", this._camera);
  }
  public setRenderCallback(cb?: RenderCallback) {
    this._renderCallback = cb;
  }

  public render() {
    if (this._renderCallback) {
      this._renderCallback();
      return;
    }
    this.renderer.clearColor();
    if (this.camera && this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  public onSceneChange(fn: (...args: any[]) => void) {
    this._onSceneChangeCallbacks.on("change", fn);
  }
  public onCameraChange(fn: (...args: any[]) => void) {
    this._onSceneChangeCallbacks.on("change", fn);
  }

  private handleResize = () => {
    const width = this._renderer.domElement.scrollWidth;
    const height = this._renderer.domElement.scrollHeight;
    this._renderer.setSize(width, height);
  };

  private handleSceneChange = (name: string, scene: Scene) => {
    if (this._sceneName === name && this._scene !== scene) {
      this._scene = scene;
      this._onSceneChangeCallbacks.emit("change", scene);
    }
  };
  private handleCameraChange = (name: string, camera: Camera) => {
    if (this._cameraName === name && this._camera !== camera) {
      this._camera = camera;
      this._onCameraChangeCallbacks.emit("change", camera);
    }
  };
}
