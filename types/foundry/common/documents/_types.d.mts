import { ActiveEffectSource, EffectChangeData, EffectDurationSource } from "./active-effect.mjs";
import { ActorDeltaSource } from "./actor-delta.mjs";
import { ActorSource } from "./actor.mjs";
import { AdventureSource } from "./adventure.mjs";
import { AmbientLightSource } from "./ambient-light.mjs";
import { AmbientSoundSource } from "./ambient-sound.mjs";
import { CardFaceData, CardSchema } from "./card.mjs";
import { CardsSource } from "./cards.mjs";
import { ChatMessageSource, ChatSpeakerData } from "./chat-message.mjs";
import { CombatantGroupSchema } from "./combatant-group.mjs";
import { CombatantSource } from "./combatant.mjs";
import { CombatSource } from "./combat.mjs";
import { DrawingSource } from "./drawing.mjs";
import { ElevatedPoint } from "@common/_types.mjs";
import { FogExplorationSource } from "./fog-exploration.mjs";
import { FolderSource } from "./folder.mjs";
import { GridDataSchema } from "./scene.mjs";
import { GridOffset2D } from "../grid/_types.mjs";
import { ItemSource } from "./item.mjs";
import { JournalEntryPageSource } from "./journal-entry-page.mjs";
import { JournalEntrySource } from "./journal-entry.mjs";
import { MacroSource } from "./macro.mjs";
import { MeasuredTemplateSource } from "./measured-template.mjs";
import { NoteSource } from "./note.mjs";
import { PlaylistSoundSource } from "./playlist-sound.mjs";
import { PlaylistSource } from "./playlist.mjs";
import { Point } from "pixi.js";
import { PrototypeTokenSource } from "@common/data/_module.mjs";
import { RegionBehaviorSource } from "./region-behavior.mjs";
import { RegionSource } from "./region.mjs";
import { RollTableSource } from "./roll-table.mjs";
import { SceneSource } from "./scene.mjs";
import { SettingSource } from "./setting.mjs";
import { ModelPropsFromSchema } from "@common/data/fields.mjs";
import { TableResultSource } from "./table-result.mjs";
import { TileOcclusionSchema, TileVideoSchema } from "./tile.mjs";
import { TileSource } from "./tile.mjs";
import { TokenShape } from "@client/canvas/placeables/token.mjs";
import { TokenSource } from "./token.mjs";
import { UserSource } from "./user.mjs";
import { WallSource } from "./wall.mjs";
import { WallThresholdSchema } from "./wall.mjs";

type CardData = ModelPropsFromSchema<CardSchema>;
type CombatantGroupData = ModelPropsFromSchema<CombatantGroupSchema>;
type GridData = ModelPropsFromSchema<GridDataSchema>;
type TileOcclusionData = ModelPropsFromSchema<TileOcclusionSchema>;
type TileVideoData = ModelPropsFromSchema<TileVideoSchema>;
type WallThresholdData = ModelPropsFromSchema<WallThresholdSchema>;

interface TokenPosition extends ElevatedPoint {
    /** The width in grid spaces (positive). */
    width: number;
    /** The height in grid spaces (positive). */
    height: number;
    /** The shape type (see {@link CONST.TOKEN_SHAPES}). */
    shape: TokenShape;
}

type TokenDimensions = Pick<TokenPosition, "width" | "height" | "shape">;

interface TokenHexagonalOffsetsData {
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
interface TokenHexagonalShapeData {
    /** The occupied offsets in even/odd rows/columns */
    offsets: { even: GridOffset2D[]; odd: GridOffset2D[]; };
    /** The points in normalized coordinates */
    points: number[];
    /** The center of the shape in normalized coordiantes */
    center: Point;
    /** The snapping anchor in normalized coordiantes, i.e. the top-left grid hex center in the snapped position */
    anchor: Point;
}

export {
    ActiveEffectSource as ActiveEffectData,
    ActorSource as ActorData,
    ActorDeltaSource as ActorDeltaData,
    AdventureSource as AdventureData,
    AmbientLightSource as AmbientLightData,
    AmbientSoundSource as AmbientSoundData,
    CardData,
    CardFaceData,
    CardsSource as CardsData,
    ChatMessageSource as ChatMessageData,
    ChatSpeakerData,
    CombatSource as CombatData,
    CombatantSource as CombatantData,
    CombatantGroupData,
    DrawingSource as DrawingData,
    EffectChangeData,
    EffectDurationSource as EffectDurationData,
    EnvironmentDataSource as EnvironmentData,
    FogExplorationSource as FogExplorationData,
    FolderSource as FolderData,
    GridData,
    ItemSource as ItemData,
    JournalEntrySource as JournalEntryData,
    JournalEntryPageSource as JournalEntryPageData,
    MacroSource as MacroData,
    MeasuredTemplateSource as MeasuredTemplateData,
    NoteSource as NoteData,
    PlaylistSource as PlaylistData,
    PlaylistSoundSource as PlaylistSoundData,
    PrototypeTokenSource as PrototypeTokenData,
    RegionBehaviorSource as RegionBehaviorData,
    RegionSource as RegionData,
    RollTableSource as RollTableData,
    SceneSource as SceneData,
    SettingSource as SettingData,
    TableResultSource as TableResultData,
    TileSource as TileData,
    TileOcclusionData,
    TileVideoData,
    TokenSource as TokenData,
    TokenDimensions,
    TokenHexagonalOffsetsData,
    TokenHexagonalShapeData,
    TokenPosition,
    UserSource as UserData,
    WallSource as WallData,
    WallThresholdData,
};
