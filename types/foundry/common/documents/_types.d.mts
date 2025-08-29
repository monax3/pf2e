export { CardFaceData, CardData } from "./card.mjs";
export { ChatMessageData, ChatSpeakerData } from "./chat-message.mjs";
export { CombatantGroupData } from "./combatant-group.mjs";
export { ActiveEffectData, EffectChangeData, EffectDurationData } from "./active-effect.mjs";
export { ActorDeltaSource } from "./actor-delta.mjs";
export { ActorData } from "./actor.mjs";
export { AdventureData } from "./adventure.mjs";
export { AmbientLightData } from "./ambient-light.mjs";
export { AmbientSoundData } from "./ambient-sound.mjs";
export { CardsData } from "./cards.mjs";
export { CombatantData } from "./combatant.mjs";
export { CombatData } from "./combat.mjs";
export { DrawingData } from "./drawing.mjs";
export { FogExplorationData } from "./fog-exploration.mjs";
export { FolderData } from "./folder.mjs";
export { GridData } from "./scene.mjs";
export { ItemData } from "./item.mjs";
export { JournalEntryCategoryData } from "./journal-entry-category.mjs";
export { JournalEntryPageData, JournalEntryPageImageData, JournalEntryPageTextData, JournalEntryPageTitleData, JournalEntryPageVideoData } from "./journal-entry-page.mjs";
export { JournalEntryData } from "./journal-entry.mjs";
export { MacroData } from "./macro.mjs";
export { MeasuredTemplateData } from "./measured-template.mjs";
export { NoteData } from "./note.mjs";
export { PlaylistSoundData } from "./playlist-sound.mjs";
export { PlaylistData } from "./playlist.mjs";
export { PrototypeTokenData } from "@common/data/_module.mjs";
export { RegionBehaviorData } from "./region-behavior.mjs";
export { RegionData } from "./region.mjs";
export { RollTableData } from "./roll-table.mjs";
export { EnvironmentData, GlobalLightData, SceneData, SceneEnvironmentData } from "./scene.mjs";
export { SettingData } from "./setting.mjs";
export { TableResultData } from "./table-result.mjs";
export { TileData, TileOcclusionData, TileRestrictionsData, TileVideoData } from "./tile.mjs";
export { TokenData, TokenBarData, TokenDetectionMode, TokenOcclusionData, TokenRingData, TokenSightData } from "./token.mjs";
export { UserData } from "./user.mjs";
export { WallData } from "./wall.mjs";
export { WallThresholdData } from "./wall.mjs";

import { Point } from "pixi.js";
import { ElevatedPoint } from "@common/_types.mjs";
import { GridOffset2D } from "../grid/_types.mjs";
import { TokenShape } from "@client/canvas/placeables/token.mjs";

export interface TokenPosition extends ElevatedPoint {
    /** The width in grid spaces (positive). */
    width: number;
    /** The height in grid spaces (positive). */
    height: number;
    /** The shape type (see {@link CONST.TOKEN_SHAPES}). */
    shape: TokenShape;
}

export type TokenDimensions = Pick<TokenPosition, "width" | "height" | "shape">;

export interface TokenHexagonalOffsetsData {
    /** The occupied offsets in an even grid in the 0th row/column */
    even: GridOffset2D[];
    /** The occupied offsets in an odd grid in the 0th row/column */
    odd: GridOffset2D[];
    /** The anchor in normalized coordiantes */
    anchor: Point;
}

/**
 * The hexagonal shape of a Token.
 */
export interface TokenHexagonalShapeData {
    /** The occupied offsets in even/odd rows/columns */
    offsets: { even: GridOffset2D[]; odd: GridOffset2D[]; };
    /** The points in normalized coordinates */
    points: number[];
    /** The center of the shape in normalized coordiantes */
    center: Point;
    /** The snapping anchor in normalized coordiantes, i.e. the top-left grid hex center in the snapped position */
    anchor: Point;
}
