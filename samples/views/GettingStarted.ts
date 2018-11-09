import * as THREE from "three";
import { Component, Vue } from "vue-property-decorator";

import { Application, components } from "../../src";

@Component({
  components: {
    ...components
  }
})
export default class GettingStarted extends Vue {
  public canvas: any = null;

  public async cubeMaterialFactory(app: Application) {
    const texture = await app.assets.textures.get("crate_Texture");

    const material = new THREE.MeshStandardMaterial({
      color: "#DDDDDD",
      metalness: 0.01
    });
    material.map = texture!;
    return material;
  }
  public async cubeGeometryFactory() {
    return new THREE.BoxBufferGeometry(1, 1, 1);
  }

  public async perspectiveCameraFactory() {
    const viewAngle = 60;
    const nearClipping = 0.1;
    const farClipping = 1000;
    return new THREE.PerspectiveCamera(
      viewAngle,
      window.innerWidth / window.innerHeight,
      nearClipping,
      farClipping
    );
  }
  public async pointLightFactory() {
    return new THREE.PointLight(0xffffff, 1, 100);
  }

  public mounted() {
    this.canvas = this.$refs.canvas;
  }
}
