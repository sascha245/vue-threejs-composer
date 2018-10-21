import { ModelType, TextureType } from "src/types";
import * as THREE from "three";

const REGEXP_EXT = /(?:\.([^.]+))?$/;

export function getFileExtension(file: string) {
  return REGEXP_EXT.exec(file)![1];
}

// export function loadTexture(src: string, name: string): Promise<TextureType> {
//   return new Promise<TextureType>((resolve, reject) => {
//     const textureLoader = new THREE.TextureLoader();
//     textureLoader.load(
//       src,
//       texture => {
//         resolve(texture);
//       },
//       undefined,
//       (e) => {
//         const err = `Texture "${name}" could not be loaded: ${e.message}`;
//         console.error(err);
//         reject(new Error(err));
//       }
//     );
//   });
// }

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
      const objLoader = new loader();
      objLoader.load(src, resolve, undefined, (e: ErrorEvent) => {
        const err = errorTransformer ? errorTransformer(e, name) : e.error;
        console.error(err);
        reject(err);
      });
    });
  };
}
