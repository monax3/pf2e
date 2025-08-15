import { default as CanvasLayer } from '../layers/base/canvas-layer.mjs';
declare class CanvasGroupMixin_base {
    /**
     * The name of this canvas group.
     */
    static groupName: string | undefined;
    /**
     * If this canvas group should teardown non-layers children.
     */
    static tearDownChildren: boolean;
    /**
     * The name used by hooks to construct their hook string.
     * Note: You should override this getter if hookName should not return the class constructor name.
     */
    get hookName(): string;
    /**
     * A mapping of CanvasLayer classes which belong to this group.
     */
    layers: Record<string, CanvasLayer>;
    /**
     * Create CanvasLayer instances which belong to the canvas group.
     */
    protected _createLayers(): Record<string, CanvasLayer>;
    /**
     * Draw the canvas group and all its components.
     * @returns A Promise which resolves once the group is fully drawn
     */
    draw(options?: object): Promise<this>;
    /**
     * Draw the canvas group and all its component layers.
     */
    protected _draw(options?: object): Promise<void>;
    /**
     * Remove and destroy all layers from the base canvas.
     */
    tearDown(options?: object): Promise<this>;
    /**
     * Remove and destroy all layers from the base canvas.
     */
    protected _tearDown(options: object): Promise<void>;
}
/**
 * A mixin which decorates any container with base canvas common properties.
 * @param {typeof PIXI.Container} ContainerClass  The parent Container class being mixed.
 * @returns A ContainerClass subclass mixed with CanvasGroupMixin features.
 */
export default function CanvasGroupMixin<TBase extends ConstructorOf<PIXI.Container>>(ContainerClass: TBase): AbstractMixin<TBase, CanvasGroupMixin_base, typeof CanvasGroupMixin_base & typeof PIXI.Container>;
export {};
