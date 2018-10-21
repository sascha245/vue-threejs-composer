import * as THREE from "three";

import { Application } from "./core";

export type GeometryType = THREE.Geometry | THREE.BufferGeometry;
export type MaterialType = THREE.MeshMaterialType;
export type TextureType = THREE.Texture;
export type ModelType = THREE.Object3D;

export type AssetType = GeometryType | MaterialType | TextureType | ModelType;

export type ModelFactory = (app: Application) => Promise<ModelType>;
export type GeometryFactory = (app: Application) => Promise<GeometryType>;
export type MaterialFactory = (app: Application) => Promise<MaterialType>;
export type TextureFactory = (app: Application) => Promise<TextureType>;
export type LightFactory = () => Promise<THREE.Light>;
export type CameraFactory = (
  size: { width: number; height: number }
) => Promise<THREE.Camera>;

export interface DisposableAsset {
  dispose?: () => void;
}

export enum AssetTypes {
  TEXTURE = "TEXTURE",
  MATERIAL = "MATERIAL",
  GEOMETRY = "GEOMETRY",
  MODEL = "MODEL"
}
