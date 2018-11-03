import { TextureLoader } from "three";

import { AssetType } from "./AssetTypes";

const REGEXP_EXT = /(?:\.([^.]+))?$/;

export interface ThreeLoaderConstructor {
  new (): ThreeLoaderInterface;
}

export interface ThreeLoaderInterface {
  load(
    name: string,
    success?: Function,
    progress?: Function,
    failure?: Function
  ): void;
}

export class Loader {
  private _extensions = new Map<string, ThreeLoaderConstructor>();

  public registerExtension(extension: string, loader: ThreeLoaderConstructor) {
    this._extensions.set(extension, loader);
  }
  public unregisterExtension(extension: string) {
    this._extensions.delete(extension);
  }

  public getFileExtension(file: string) {
    return REGEXP_EXT.exec(file)![1];
  }

  public promisifyLoader<T>(
    loaderCtor: ThreeLoaderConstructor,
    errorTransformer?: (e: ErrorEvent, name: string) => any
  ) {
    return (src: string, name: string) => {
      return new Promise<T>((resolve, reject) => {
        if (!loaderCtor) {
          return reject(new Error(`Loader for "${name}" is undefined`));
        }
        const loader = new loaderCtor();
        loader.load(src, resolve, undefined, (e: ErrorEvent) => {
          const err = errorTransformer ? errorTransformer(e, name) : e.error;
          console.error(err);
          reject(err);
        });
      });
    };
  }

  public load(src: string, name: string): Promise<AssetType> {
    const ext = this.getFileExtension(src);
    const loaderClass = this._extensions.get(ext);
    if (!loaderClass) {
      throw new Error(
        `Asset "${name}" could not be loaded: extension ${ext} is not registered`
      );
    }
    return new Promise((resolve, reject) => {
      const loader = new loaderClass();
      loader.load(src, resolve, undefined, (e: ErrorEvent) => {
        const err = new Error(
          `Asset "${name}" could not be loaded: ${e.message}`
        );
        reject(err);
      });
    });
  }

  public texture = this.promisifyLoader<THREE.Texture>(
    TextureLoader,
    (e, name) => {
      return new Error(`Model "${name}" could not be loaded: ${e.message}`);
    }
  );
}
