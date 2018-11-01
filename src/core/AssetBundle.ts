import { EventEmitter } from "events";

import { AssetType, OnProgressCallback } from "../types";

type AssetBundleHook = "load" | "unload" | "loaded" | "progress";
type AssetBundleListener = (...args: any[]) => any;
type AssetBundlePromiseListener = (...args: any[]) => Promise<void>;

export class AssetBundle {
  private static id: number = 0;
  private _id: number = 0;

  public name?: string;

  private _usages: number = 0;

  private _assets: Array<Promise<AssetType>> = [];
  private _dependencies: AssetBundle[] = [];

  private _preparePromise?: Promise<void> | undefined;
  private _unloadPromise?: Promise<void> | undefined;
  private _readyPromise?: Promise<void> | undefined;

  private _hooks: EventEmitter = new EventEmitter();

  constructor(name?: string) {
    this._id = AssetBundle.id++;
    this.name = name;
  }

  // public get ready() {
  //   return this._readyPromise;
  // }

  public isReady() {
    return this._readyPromise;
  }

  public isUsed() {
    return !!this._usages;
  }

  /**
   * Use bundle
   */
  public use(): Promise<void> {
    const usages = this._usages;
    ++this._usages;
    if (!usages) {
      this.loadBundle();
    }
    return this._preparePromise ? this._preparePromise : Promise.resolve();
  }

  /**
   * Unuse bundle once it is not used anymore
   */
  public unuse() {
    if (this._usages > 0) {
      --this._usages;
      if (!this._usages) {
        // console.log("unload bundle", this.name);
        this.unloadBundle();
      }
    }
    return Promise.resolve();
    // return this._unloadPromise ? this._unloadPromise : Promise.resolve();
  }

  /**
   * Register asset
   * @param bundles
   */
  public registerAsset(pAsset: Promise<AssetType>) {
    this._assets.push(pAsset);
  }

  /**
   * Register dependency
   * @param bundle
   */
  public async registerDependency(bundle: AssetBundle) {
    this._dependencies.push(bundle);
    await bundle.use();
  }

  /**
   * Register multiple dependencies
   * @param bundles
   */
  public async registerDependencies(bundles: AssetBundle[]) {
    const p = bundles.map(bundle => this.registerDependency(bundle));
    await Promise.all(p);
  }

  /**
   * Count total number of assets across all given bundle and all their dependencies
   * @param bundles
   */
  public static countAssets(bundles: AssetBundle[]): number {
    const countMap = new Map<AssetBundle, number>();
    bundles.forEach(bundle => this.recursiveCountAssets(countMap, bundle));

    let total = 0;
    countMap.forEach(amount => {
      total += amount;
    });
    return total;
  }
  /**
   * Count total number of assets across this bundle and all dependencies
   */
  public countAssets() {
    return AssetBundle.countAssets([this]);
  }

  /**
   * List of all assets across all given bundles and all their dependencies
   * @param bundles
   */
  public static listAssets(bundles: AssetBundle[]): Array<Promise<AssetType>> {
    const map = new Map<AssetBundle, Array<Promise<AssetType>>>();
    bundles.forEach(bundle => this.recursiveListAssets(map, bundle));

    const list = Array.from(map.values());
    const assets = ([] as Array<Promise<AssetType>>).concat(...list);
    return assets;
  }
  /**
   * List of all assets across this bundle and all dependencies
   */
  public listAssets() {
    return AssetBundle.listAssets([this]);
  }

  public on(type: AssetBundleHook, fn: AssetBundleListener) {
    this._hooks.on(type, fn);
  }
  public off(type: AssetBundleHook, fn: AssetBundleListener) {
    this._hooks.removeListener(type, fn);
  }
  private emit(type: AssetBundleHook): Array<Promise<void>> {
    const listeners = this._hooks.listeners(type);
    return listeners.map(listener =>
      (listener as AssetBundlePromiseListener)()
    );
  }
  private emitProgress(amount: number, total: number) {
    const type: AssetBundleHook = "progress";
    this._hooks.emit(type, amount, total);
  }

  private loadBundle(): void {
    if (this._preparePromise) {
      return;
    }

    const optionalUnload = this._unloadPromise
      ? this._unloadPromise
      : Promise.resolve();

    this._unloadPromise = undefined;

    const prepare = optionalUnload.then(() => {
      return Promise.all(this.emit("load")) as Promise<any>;
    });

    const ready = prepare
      .then(() => {
        // go to next tick to allow user code to execute first before ready
        return new Promise(r => setTimeout(r, 0));
      })
      .then(() => {
        // await and handle loading progress for all assets
        return this.awaitAllAssets();
      })
      .then(() => {
        // finish loading
        this.emit("loaded");
        return Promise.resolve();
      });

    this._preparePromise = prepare;
    this._readyPromise = ready;
  }

  private unloadBundle() {
    if (this._unloadPromise) {
      return this._unloadPromise;
    }

    const isReady = this._readyPromise ? this._readyPromise : Promise.resolve();

    this._preparePromise = undefined;
    this._readyPromise = undefined;

    const p = this._dependencies.map(dep => dep.unuse());

    this._dependencies = [];
    this._assets = [];

    this._unloadPromise = isReady
      .then(() => {
        return Promise.all(this.emit("unload"));
      })
      .then(() => {
        // const p = this._dependencies.map(dep => dep.unuse());
        return Promise.all(p) as Promise<any>;
      })
      .then(() => {
        // this._dependencies = [];
        // this._assets = [];
        return Promise.resolve();
      });
  }

  private awaitAllAssets(): Promise<void> {
    const allAssets = this.listAssets();
    const total = allAssets.length;
    let count = 0;

    const pAssets = allAssets.map(assetPromise => {
      return assetPromise.then(asset => {
        // console.log(`asset ${asset.name} loaded`);
        ++count;
        this.emitProgress(count, total);
        return Promise.resolve();
      });
    });

    return Promise.all(pAssets) as Promise<any>;
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

  private static recursiveListAssets(
    map: Map<AssetBundle, Array<Promise<AssetType>>>,
    pBundle: AssetBundle
  ) {
    if (!map.has(pBundle)) {
      map.set(pBundle, pBundle._assets);
    }
    pBundle._dependencies.forEach(bundle => {
      this.recursiveListAssets(map, bundle);
    });
  }
}
