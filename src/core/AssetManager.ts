import {
    AssetType, AssetTypes, DisposableAsset, GeometryType, MaterialType, ModelType, TextureType
} from "../types";
import { Application } from "./Application";
import { AssetBundle } from "./AssetBundle";

export class AssetManager {
  private textures: Map<string, Promise<TextureType>> = new Map();
  private materials: Map<string, Promise<MaterialType>> = new Map();
  private geometries: Map<string, Promise<GeometryType>> = new Map();
  private models: Map<string, Promise<ModelType>> = new Map();

  private _app: Application;
  private _bundles: Map<string, AssetBundle> = new Map();

  constructor(app: Application) {
    this._app = app;
  }

  public createBundle(name: string) {
    const bundle = new AssetBundle(this._app);
    this._bundles.set(name, bundle);
    return bundle;
  }
  public getBundle(name: string) {
    return this._bundles.get(name);
  }
  public deleteBundle(name: string) {
    this._bundles.delete(name);
  }

  public add(name: string, type: AssetTypes, asset: Promise<AssetType>) {
    switch (type) {
      case AssetTypes.TEXTURE:
        this.addToMap(this.textures, name, asset, "Texture");
        break;
      case AssetTypes.MATERIAL:
        this.addToMap(this.materials, name, asset, "Material");
        break;
      case AssetTypes.GEOMETRY:
        this.addToMap(this.geometries, name, asset, "Geometry");
        break;
      case AssetTypes.MODEL:
        this.addToMap(this.models, name, asset, "Model");
        break;
    }
  }

  public get(name: string, type: AssetTypes): Promise<AssetType> | undefined {
    switch (type) {
      case AssetTypes.TEXTURE:
        return this.textures.get(name);
      case AssetTypes.MATERIAL:
        return this.materials.get(name);
      case AssetTypes.GEOMETRY:
        return this.geometries.get(name);
      case AssetTypes.MODEL:
        return this.models.get(name);
    }
  }

  public remove(name: string, type: AssetTypes) {
    switch (type) {
      case AssetTypes.TEXTURE:
        this.removeFromMap(this.textures, name, "Texture");
        break;
      case AssetTypes.MATERIAL:
        this.removeFromMap(this.materials, name, "Material");
        break;
      case AssetTypes.GEOMETRY:
        this.removeFromMap(this.geometries, name, "Geometry");
        break;
      case AssetTypes.MODEL:
        this.removeFromMap(this.models, name, "Model");
        break;
    }
  }

  private disposeAsset(asset: Promise<AssetType>) {
    asset.then(value => {
      const disposable = asset as DisposableAsset;
      if (disposable.dispose) {
        disposable.dispose();
      }
    });
  }

  private addToMap<T>(
    map: Map<string, Promise<T>>,
    name: string,
    asset: Promise<T>,
    errorPrefix: string
  ) {
    if (map.has(name)) {
      throw new Error(
        `${errorPrefix} with name "${name}" could not be added: entry already exists in AssetManager`
      );
    }
    map.set(name, asset);
  }

  private removeFromMap(
    map: Map<string, Promise<AssetType>>,
    name: string,
    errorPrefix: string
  ) {
    const asset = map.get(name);
    if (!asset) {
      throw new Error(
        `${errorPrefix} with name "${name}" could not be removed: entry does not exist in AssetManager`
      );
    }
    map.delete(name);
    this.disposeAsset(asset);
  }
}
