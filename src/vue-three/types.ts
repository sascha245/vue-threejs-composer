import * as THREE from "three";

export type GeometryType = THREE.Geometry | THREE.BufferGeometry;
export type MaterialType = THREE.MeshMaterialType;
export type TextureType = THREE.Texture;

export type AssetType = GeometryType | MaterialType | TextureType;

export type GeometryFactory = () => Promise<GeometryType>;
export type MaterialFactory = () => Promise<MaterialType>;
export type TextureFactory = () => Promise<TextureType>;
export type LightFactory = () => Promise<THREE.Light>;
export type CameraFactory = (
  size: { width: number; height: number }
) => Promise<THREE.Camera>;

export enum AssetTypes {
  TEXTURE = "TEXTURE",
  MATERIAL = "MATERIAL",
  GEOMETRY = "GEOMETRY"
}
