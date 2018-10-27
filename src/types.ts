import * as THREE from "three";

import { Application } from "./core";

export type MeshMaterialType =
  | THREE.MeshBasicMaterial
  | THREE.MeshDepthMaterial
  | THREE.MeshFaceMaterial
  | THREE.MeshLambertMaterial
  | THREE.MeshNormalMaterial
  | THREE.MeshPhongMaterial
  | THREE.MeshStandardMaterial
  | THREE.ShaderMaterial
  | THREE.ShadowMaterial;

export type GeometryType = THREE.Geometry | THREE.BufferGeometry;
export type MaterialType = MeshMaterialType;
export type TextureType = THREE.Texture;
export type ModelType = THREE.Object3D;

export type AssetType = GeometryType | MaterialType | TextureType | ModelType;

export type ModelFactory = (app: Application) => Promise<ModelType>;
export type GeometryFactory = (app: Application) => Promise<GeometryType>;
export type MaterialFactory = (app: Application) => Promise<MaterialType>;
export type TextureFactory = (app: Application) => Promise<TextureType>;
export type LightFactory = (app: Application) => Promise<THREE.Light>;
export type CameraFactory = (app: Application) => Promise<THREE.Camera>;

export interface DisposableAsset {
  dispose?: () => void;
}

export enum AssetTypes {
  TEXTURE = "TEXTURE",
  MATERIAL = "MATERIAL",
  GEOMETRY = "GEOMETRY",
  MODEL = "MODEL"
}
