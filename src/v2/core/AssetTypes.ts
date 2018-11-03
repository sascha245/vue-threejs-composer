import * as THREE from "three";

import { Application } from "./Application";

export type TextureType = THREE.Texture;
export type MaterialType =
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
export type ModelType = THREE.Object3D;
export type LightType = THREE.Light;
export type CameraType = THREE.Camera;

export type AssetType = GeometryType | MaterialType | TextureType | ModelType;

export type ModelFactory = (app: Application) => Promise<ModelType>;
export type GeometryFactory = (app: Application) => Promise<GeometryType>;
export type MaterialFactory = (app: Application) => Promise<MaterialType>;
export type TextureFactory = (app: Application) => Promise<TextureType>;
export type LightFactory = (app: Application) => Promise<LightType>;
export type CameraFactory = (app: Application) => Promise<CameraType>;
