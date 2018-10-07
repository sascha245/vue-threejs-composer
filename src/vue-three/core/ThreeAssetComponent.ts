import { ThreeComponent, ThreeSceneComponent } from "./";

export abstract class ThreeAssetComponent<T> extends ThreeComponent {
  public asset!: Promise<T>;
}
