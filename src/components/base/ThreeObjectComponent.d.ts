import { Object3D } from "three";
import { Vue } from "vue-property-decorator";
export declare class ThreeObjectComponent extends Vue {
    protected object: (() => Object3D) | undefined;
}
