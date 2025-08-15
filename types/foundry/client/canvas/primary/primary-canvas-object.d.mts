import { TextureData } from '../../../common/data/data.mjs';
import type * as fields from "@common/data/fields.mjs";
export interface PrimaryCanvasObjectData {
    /** The x-coordinate of the PCO location */
    x: number;
    /** The y-coordinate of the PCO location */
    y: number;
    /** The z-index of the PCO */
    z: number;
    /** The width of the PCO */
    width: number;
    /** The height of the PCO */
    height: number;
    /** The alpha of this PCO */
    alpha: number;
    /** The rotation of this PCO */
    rotation: number;
    /** The PCO is hidden? */
    hidden: boolean;
    /** The elevation of the PCO */
    elevation: number | undefined;
    /** The sort key that resolves ties among the same elevation */
    sort: number;
    /** The data texture values */
    texture: fields.SourceFromDataField<TextureData>;
}
export declare abstract class PrimaryCanvasObjectMixin_base extends CanvasTransformMixin_base {
    /**
     * An optional reference to the object that owns this PCO.
     * This property does not affect the behavior of the PCO itself.
     * @default null
     */
    object: object | null;
    /** The elevation of this object. */
    get elevation(): number;
    set elevation(value: number);
    /** A key which resolves ties amongst objects at the same elevation within the same layer. */
    get sort(): number;
    set sort(value: number);
    /** A key which resolves ties amongst objects at the same elevation of different layers. */
    get sortLayer(): number;
    set sortLayer(value: number);
    /**
     * Event fired when this display object is added to a parent.
     * @param parent The new parent container.
     */
    _onAdded(parent: PIXI.Container): void;
    /**
     * Event fired when this display object is removed from its parent.
     * @param parent Parent from which the PCO is removed.
     */
    _onRemoved(parent: PIXI.Container): void;
    /** Does this object render to the depth buffer? */
    get shouldRenderDepth(): boolean;
    /** Render the depth of this object. */
    renderDepthData(renderer: PIXI.Renderer): void;
}
/**
 * A mixin which decorates a DisplayObject with additional properties expected for rendering in the PrimaryCanvasGroup.
 * @category - Mixins
 * @param DisplayObject The parent DisplayObject class being mixed
 * @returns A DisplayObject subclass mixed with PrimaryCanvasObject features
 * @mixin
 */
export default function PrimaryCanvasObjectMixin<TBase extends ConstructorOf<PIXI.DisplayObject>>(DisplayObject: TBase): AbstractMixin<TBase, PrimaryCanvasObjectMixin_base & CanvasTransformMixin_base, typeof PrimaryCanvasObjectMixin_base & typeof CanvasTransformMixin_base & typeof PIXI.DisplayObject>;
export declare abstract class CanvasTransformMixin_base extends PIXI.DisplayObject {
    /** The transform matrix from local space to canvas space. */
    canvasTransform: PIXI.Matrix;
    /**
     * The update ID of canvas transform matrix.
     * @internal
     */
    _canvasTransformID: number;
    /** The canvas bounds of this object. */
    canvasBounds: PIXI.Rectangle;
    /** The canvas bounds of this object. */
    protected _canvasBounds: PIXI.Bounds;
    /**
     * The update ID of the canvas bounds.
     * Increment to force recalculation.
     */
    protected _canvasBoundsID: number;
    /** Calculate the canvas bounds of this object. */
    protected _calculateCanvasBounds(): void;
    /** Recalculate the canvas transform and bounds of this object and its children, if necessary. */
    updateCanvasTransform(): void;
    /** Called when the canvas transform changed. */
    protected _onCanvasTransformUpdate(): void;
    /** Called when the canvas bounds changed. */
    protected _onCanvasBoundsUpdate(): void;
    /**
     * Is the given point in canvas space contained in this object?
     * @param point The point in canvas space.
     */
    containsCanvasPoint(point: PIXI.IPointData): boolean;
}
/**
 * A mixin which decorates a DisplayObject with additional properties for canvas transforms and bounds.
 * @category - Mixins
 * @param DisplayObject The parent DisplayObject class being mixed
 * @mixin
 */
export declare function CanvasTransformMixin<TBase extends ConstructorOf<PIXI.DisplayObject>>(DisplayObject: TBase): AbstractMixin<TBase, CanvasTransformMixin_base, typeof CanvasTransformMixin_base & typeof PIXI.DisplayObject>;
export type PrimaryCanvasObject = ReturnType<typeof PrimaryCanvasObjectMixin>;
export {};
