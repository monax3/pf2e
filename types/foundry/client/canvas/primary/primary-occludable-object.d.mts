import { TileOcclusionMode } from '../../../common/constants.mjs';
import { default as Token } from '../placeables/token.mjs';
import { PrimaryCanvasObjectMixin_base } from './primary-canvas-object.mjs';
declare abstract class PrimaryOccludableObjecMixin_base extends PrimaryCanvasObjectMixin_base {
    /** Is this occludable object hidden for Gamemaster visibility only? */
    hidden: boolean;
    /** A flag which tracks whether the primary canvas object is currently in an occluded state. */
    occluded: boolean;
    /** The occlusion mode of this occludable object. */
    occlusionMode: TileOcclusionMode;
    /** The unoccluded alpha of this object. */
    unoccludedAlpha: number;
    /** The occlusion alpha of this object. */
    occludedAlpha: number;
    /**
     * Fade this object on hover?
     * @defaultValue true
     */
    get hoverFade(): boolean;
    set hoverFade(value: boolean);
    /**
     * The amount of rendered FADE, RADIAL, and VISION occlusion.
     * @internal
     */
    _occlusionState: OcclusionState;
    /** The state of hover-fading. */
    _hoverFadeState: HoverFadeState;
    /** Get the blocking option bitmask value. */
    get _restrictionState(): number;
    /** Is this object blocking light? */
    get restrictsLight(): boolean;
    set restrictsLight(enabled: boolean);
    /** Is this object blocking weather? */
    get restrictsWeather(): boolean;
    set restrictsWeather(enabled: boolean);
    /** Is this occludable object... occludable? */
    get isOccludable(): boolean;
    /**
     * Debounce assignment of the PCO occluded state to avoid cases like animated token movement which can rapidly
     * change PCO appearance.
     * Uses a 50ms debounce threshold.
     * Objects which are in the hovered state remain occluded until their hovered state ends.
     * @type {function(occluded: boolean): void}
     */
    debounceSetOcclusion: () => void;
    updateCanvasTransform(): void;
    /**
     * Test whether a specific Token occludes this PCO.
     * Occlusion is tested against 9 points, the center, the four corners-, and the four cardinal directions
     * @param token     The Token to test
     * @param [options] Additional options that affect testing
     * @param [options.corners=true] Test corners of the hit-box in addition to the token center?
     * @returns Is the Token occluded by the PCO?
     */
    testOcclusion(token: Token, options?: {
        corner?: boolean;
    }): boolean;
}
/**
 * A mixin which decorates a DisplayObject with depth and/or occlusion properties.
 * @category - Mixins
 * @param DisplayObject The parent DisplayObject class being mixed
 * @returns A DisplayObject subclass mixed with OccludableObject features
 * @mixin
 */
export default function PrimaryOccludableObjectMixin<TBase extends ConstructorOf<PIXI.DisplayObject>>(DisplayObject: TBase): AbstractMixin<TBase, PrimaryOccludableObjecMixin_base, typeof PrimaryOccludableObjecMixin_base & typeof PIXI.DisplayObject>;
export interface OcclusionState {
    /** The amount of FADE occlusion */
    fade: number;
    /** The amount of RADIAL occlusion */
    radial: number;
    /** The amount of VISION occlusion */
    vision: number;
}
export interface HoverFadeState {
    /** The hovered state */
    hovered: boolean;
    /** The last time when a mouse event was hovering this object */
    hoveredTime: number;
    /** The faded state */
    faded: boolean;
    /** The fading state */
    fading: boolean;
    /** The time the fade animation started */
    fadingTime: number;
    /** The amount of occlusion */
    occlusion: number;
}
export {};
