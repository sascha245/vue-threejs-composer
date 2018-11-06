import { Application } from "./Application";
import { BundleHandle } from "./BundleHandle";
import { HandleMap } from "./HandleMap";

export class BundleManager extends HandleMap<BundleHandle> {
  constructor(private app: Application) {
    super(BundleHandle);
  }
}
