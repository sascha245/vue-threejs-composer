import { AssetMapErrors, HandlerMapErrors } from "./Errors";

interface DisposableAsset {
  dispose?: () => void;
}

export class AssetMap<T> {
  protected _data = new Map<string, Promise<T>>();

  public size() {
    return this._data.size;
  }

  public set(name: string, asset: Promise<T>): void {
    if (this._data.has(name)) {
      console.log("asset already exists in map", name);
      throw AssetMapErrors.ALREADY_EXISTS;
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

    const asset = this._data.get(name);
    if (asset) {
      this.disposeHook(asset);
      this._data.delete(name);
    }
  }

  protected disposeHook(asset: Promise<T>) {
    const disposable = asset as DisposableAsset;
    if (disposable.dispose) {
      disposable.dispose();
    }
  }
}
