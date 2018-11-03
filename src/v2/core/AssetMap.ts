import { HandlerMapErrors } from "./Errors";

interface DisposableAsset {
  dispose?: () => void;
}

export class AssetMap<T> {
  protected _data = new Map<string, Promise<T>>();

  public set(name: string, asset: Promise<T>): void {
    if (this._data.has(name)) {
      throw HandlerMapErrors.ALREADY_EXISTS;
    }
    this._data.set(name, asset);
  }
  public get(name: string): Promise<T> | undefined {
    return this._data.get(name);
  }
  public dispose(name?: string) {
    if (!name) {
      this._data.forEach(item => {
        this.disposeHook(item);
      });
      this._data.clear();
      return;
    }

    const handler = this._data.get(name);
    if (handler) {
      this.disposeHook(handler);
    }
  }

  protected disposeHook(asset: Promise<T>) {
    const disposable = asset as DisposableAsset;
    if (disposable.dispose) {
      disposable.dispose();
    }
  }
}
