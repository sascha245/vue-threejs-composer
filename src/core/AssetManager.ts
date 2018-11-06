import { Application } from "./Application";
import { AssetMap } from "./AssetMap";
import { GeometryType, MaterialType, ModelType, TextureType } from "./AssetTypes";
import { BundleManager } from "./BundleManager";

export class AssetManager {
  private _app: Application;
  private _bundles = new BundleManager(this._app);

  private _textures = new AssetMap<TextureType>();
  private _materials = new AssetMap<MaterialType>();
  private _geometries = new AssetMap<GeometryType>();
  private _models = new AssetMap<ModelType>();

  constructor(app: Application) {
    this._app = app;
  }

  public get bundles() {
    return this._bundles;
  }

  public get textures() {
    return this._textures;
  }
  public get materials() {
    return this._materials;
  }
  public get geometries() {
    return this._geometries;
  }
  public get models() {
    return this._models;
  }
}
