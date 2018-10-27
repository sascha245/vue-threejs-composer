import { WebGLRendererParameters } from "three";

import { Application } from "./Application";
import { RendererHandler } from "./RendererHandler";

export class RendererManager {
  private _renderers: RendererHandler[] = [];
  private _app: Application;

  public constructor(app: Application) {
    this._app = app;
  }

  private add(handler: RendererHandler) {
    this._renderers.push(handler);
  }

  private remove(handler: RendererHandler) {
    const index = this._renderers.indexOf(handler);
    if (index !== -1) {
      this._renderers.splice(index, 1);
    }
  }

  public create(options?: WebGLRendererParameters) {
    const handler = new RendererHandler(this._app, options);
    this.add(handler);
    return handler;
  }
  public dispose(handler: RendererHandler) {
    handler.dispose();
    this.remove(handler);
  }

  public render() {
    this._renderers.forEach(renderer => renderer.render());
  }
}
