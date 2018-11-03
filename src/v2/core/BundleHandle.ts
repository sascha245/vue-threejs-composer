import { AssetType } from "./AssetTypes";
import { EventDispatcher } from "./EventDispatcher";
import { Handle } from "./Handle";

export class BundleHandle extends Handle {
  private _assets: Array<Promise<AssetType>> = [];
  private _dependencies: BundleHandle[] = [];
  private _registered = this.queue;

  private _onLoadProgress = new EventDispatcher<
    (amount: number, total: number) => Promise<void>
  >();

  public get onLoadProgress() {
    return this._onLoadProgress;
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
  public registerDependency(bundle: BundleHandle) {
    this._dependencies.push(bundle);
    bundle.use();
    // we don't need to wait until it is completely loaded
    // only until all assets are registered
    return bundle._registered;
  }

  /**
   * Register multiple dependencies
   * @param bundles
   */
  public registerDependencies(bundles: BundleHandle[]) {
    const p = bundles.map(bundle => this.registerDependency(bundle));
    return Promise.all(p);
  }

  /**
   * Count total number of assets across all given bundle and all their dependencies
   * @param bundles
   */
  public static countAssets(bundles: BundleHandle[]): number {
    const countMap = new Map<BundleHandle, number>();
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
    return BundleHandle.countAssets([this]);
  }

  /**
   * List of all assets across all given bundles and all their dependencies
   * @param bundles
   */
  public static listAssets(bundles: BundleHandle[]): Array<Promise<AssetType>> {
    const map = new Map<BundleHandle, Array<Promise<AssetType>>>();
    bundles.forEach(bundle => this.recursiveListAssets(map, bundle));

    const arr: Array<Promise<AssetType>> = [];
    const list = Array.from(map.values());
    const assets = arr.concat(...list);
    return assets;
  }
  /**
   * List of all assets across this bundle and all dependencies
   */
  public listAssets() {
    return BundleHandle.listAssets([this]);
  }

  protected load() {
    console.log("bundle load");
    this._registered = super.load();
    return this._registered
      .then(() => {
        // go to next tick to allow user code to execute first before ready
        return new Promise(r => setTimeout(r, 0));
      })
      .then(() => {
        return this.awaitAllAssets();
      });
  }

  protected unload() {
    console.log("bundle unload");
    const p = super.unload();
    return p
      .then(() => {
        const deps = this._dependencies.map(dep => dep.unuse());
        return Promise.all(deps).then(() => Promise.resolve());
      })
      .then(() => {
        this._dependencies = [];
        this._assets = [];
        return Promise.resolve();
      });
  }

  private awaitAllAssets(): Promise<void> {
    const allAssets = this.listAssets();
    const total = allAssets.length;
    let count = 0;

    console.log(
      `bundle await all ${allAssets.length} assets from ${
        this._dependencies.length
      } bundles`
    );

    const pAssets = allAssets.map(assets => {
      return assets.then(() => {
        ++count;
        const progress = this._onLoadProgress.listeners.map(fn =>
          fn(count, total)
        );
        return Promise.all(progress);
      });
    });

    return Promise.all(pAssets).then(() => Promise.resolve());
  }

  private static recursiveCountAssets(
    map: Map<BundleHandle, number>,
    pBundle: BundleHandle
  ) {
    if (!map.has(pBundle)) {
      map.set(pBundle, pBundle._assets.length);
    }
    pBundle._dependencies.forEach(bundle => {
      this.recursiveCountAssets(map, bundle);
    });
  }

  private static recursiveListAssets(
    map: Map<BundleHandle, Array<Promise<AssetType>>>,
    pBundle: BundleHandle
  ) {
    if (!map.has(pBundle)) {
      map.set(pBundle, pBundle._assets);
    }
    pBundle._dependencies.forEach(bundle => {
      this.recursiveListAssets(map, bundle);
    });
  }
}
