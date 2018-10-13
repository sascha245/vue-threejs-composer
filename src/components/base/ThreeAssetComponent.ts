import { Component, Vue } from "vue-property-decorator";

import { AssetType } from "../../types";

@Component
export class ThreeAssetComponent extends Vue {
  public asset!: Promise<AssetType>;
}
