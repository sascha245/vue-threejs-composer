import * as THREE from "three";

import { Application, GeometryFactory } from "../../src";

export const cubeFactory: GeometryFactory = async (app: Application) => {
  return new THREE.BoxBufferGeometry(1, 1, 1);
};

export const planeFactory: GeometryFactory = async () => {
  return new THREE.PlaneBufferGeometry(100, 100);
};
