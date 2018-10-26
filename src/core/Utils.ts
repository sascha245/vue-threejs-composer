import * as THREE from "three";

import { ModelType, TextureType } from "../types";

const REGEXP_EXT = /(?:\.([^.]+))?$/;

export function getFileExtension(file: string) {
  return REGEXP_EXT.exec(file)![1];
}

export const loadTexture = loaderPromisify<TextureType>(
  THREE.TextureLoader,
  (e, name) => {
    return new Error(`Texture "${name}" could not be loaded: ${e.message}`);
  }
);

export function loadModel(src: string, name: string): Promise<ModelType> {
  const ext = getFileExtension(src);
  switch (ext.toLowerCase()) {
    case "obj":
      return loadObj(src, name);
    case "fbx":
      return loadFbx(src, name);
    default:
      throw new Error(
        `Model "${name}" could not be loaded: unsupported extension`
      );
  }
}

export const loadObj = loaderPromisify<ModelType>(
  THREE.OBJLoader,
  (e, name) => {
    return new Error(`Model "${name}" could not be loaded: ${e.message}`);
  }
);

export const loadFbx = loaderPromisify<ModelType>(
  THREE.FBXLoader,
  (e, name) => {
    return new Error(`Model "${name}" could not be loaded: ${e.message}`);
  }
);

function loaderPromisify<T>(
  loader: any,
  errorTransformer?: (e: ErrorEvent, name: string) => Error
) {
  return (src: string, name: string) => {
    return new Promise<T>((resolve, reject) => {
      if (!loader) {
        return reject(new Error(`Loader for "${name}" is undefined`));
      }
      const objLoader = new loader();
      objLoader.load(src, resolve, undefined, (e: ErrorEvent) => {
        const err = errorTransformer ? errorTransformer(e, name) : e.error;
        console.error(err);
        reject(err);
      });
    });
  };
}
