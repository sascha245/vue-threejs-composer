import { Application } from "./Application";
import { HandleMap } from "./HandleMap";
import { RendererHandle } from "./RendererHandle";

export class RendererManager extends HandleMap<RendererHandle> {
  constructor(private app: Application) {
    super(RendererHandle);
  }

  protected factoryHook() {
    return new RendererHandle(this.app);
  }

  public render() {
    return this._data.forEach(handler => handler.render());
  }
}
