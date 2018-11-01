import { AssetType, OnLoadAssetBundleData, OnProgressCallback } from "../types";
import { Application } from "./Application";

export class AssetBundle {
  private _app: Application;
  private _usages: number = 0;

  private _assets: Array<Promise<AssetType>> = [];
  private _dependencies: AssetBundle[] = [];

  public onload?: () => Promise<void>;
  public onloaded?: () => Promise<void>;
  public onunload?: () => void;

  private _onLoadProgress?: OnProgressCallback;

  private _preparePromise?: Promise<void> | undefined;
  private _unloadPromise?: Promise<void> | undefined;
  private _readyPromise?: Promise<void> | undefined;

  constructor(app: Application) {
    this._app = app;
  }

  public isReady() {
    return this._readyPromise;
  }
  public isUsed() {
    return !!this._usages;
  }

  public use(progress: OnProgressCallback): Promise<void> {
    const usages = this._usages;
    ++this._usages;
    if (!usages) {
      console.log("load bundle", this);
      this.loadBundle(progress);
    }
    return this._preparePromise ? this._preparePromise : Promise.resolve();
  }

  public unuse() {
    if (this._usages > 0) {
      --this._usages;
      if (!this._usages) {
        console.log("unload bundle", this);
        this._unloadPromise = this.unloadBundle();
      }
    }
    return this._unloadPromise ? this._unloadPromise : Promise.resolve();
  }

  public registerAsset(pAsset: Promise<AssetType>) {
    const p = pAsset.then(asset => {
      if (this._onLoadProgress) {
        this._onLoadProgress();
      }
      return Promise.resolve(asset);
    });
    this._assets.push(p);
  }

  public async registerDependency(bundle: AssetBundle) {
    if (!this._onLoadProgress) {
      throw new Error(`AssetBundle: progress function is undefined`);
    }
    this._dependencies.push(bundle);
    await bundle.use(this._onLoadProgress);
  }

  public async registerDependencies(bundles: AssetBundle[]) {
    const p = bundles.map(bundle => this.registerDependency(bundle));
    await Promise.all(p);
  }

  public static countAssets(bundles: AssetBundle[]): number {
    const countMap = new Map<AssetBundle, number>();
    bundles.forEach(bundle => this.recursiveCountAssets(countMap, bundle));

    let total = 0;
    countMap.forEach(amount => {
      total += amount;
    });
    return total;
  }

  private static recursiveCountAssets(
    map: Map<AssetBundle, number>,
    pBundle: AssetBundle
  ) {
    if (!map.has(pBundle)) {
      map.set(pBundle, pBundle._assets.length);
    }
    pBundle._dependencies.forEach(bundle => {
      this.recursiveCountAssets(map, bundle);
    });
  }

  private loadBundle(progress: OnProgressCallback): void {
    if (!this.onload) {
      throw new Error(`AssetBundle: no "onload" function is defined`);
    }

    this._onLoadProgress = progress;

    const prepare = this.reset().then(() => {
      return this.onload!();
    });

    const ready = prepare
      .then(() => {
        return this.ready();
      })
      .then(() => {
        if (this.onloaded) {
          return this.onloaded();
        }
        return Promise.resolve();
      });

    this._preparePromise = prepare;
    this._readyPromise = ready;
  }

  private ready = async () => {
    const pDeps = this._dependencies.map(async dep => {
      if (dep.isReady()) {
        return dep.isReady();
      }
      return Promise.resolve();
    });

    const p = (this._assets as Array<Promise<any>>).concat(pDeps);
    await Promise.all(p);
  };

  private async unloadBundle() {
    if (this.onunload) {
      await this.onunload();
    }
    await this.reset();
  }

  private async reset() {
    const p = this._dependencies.map(dep => dep.unuse());
    await Promise.all(p);

    this._assets = [];
    this._dependencies = [];
  }
}
