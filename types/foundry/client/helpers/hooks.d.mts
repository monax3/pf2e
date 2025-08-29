import { ApplicationRenderContext, ApplicationRenderOptions } from "@client/applications/_module.mjs";
import { EditorState } from "prosemirror-state";
import type { DialogV2 } from "@client/applications/api/_module.mjs";
import type { CombatTrackerConfig } from "@client/applications/apps/_module.mjs";
import SettingsConfig from "@client/applications/settings/config.mjs";
import ChatPopout from "@client/applications/sidebar/apps/chat-popout.mjs";
import { ContextMenuEntry } from "@client/applications/ux/context-menu.mjs";
import Canvas from "@client/canvas/board.mjs";
import LightingLayer from "@client/canvas/layers/lighting.mjs";
import Token from "@client/canvas/placeables/token.mjs";
import {
    Actor,
    ChatMessage,
    Combat,
    Item,
    JournalEntry,
    JournalEntryPage,
    Macro,
    Scene,
    TokenDocument,
    User,
} from "@client/documents/_module.mjs";
import { CanvasEnvironmentConfig } from "@client/client.mjs";
import { DocumentUUID } from "@client/utils/helpers.mjs";
import { DatabaseCreateOperation, DatabaseDeleteOperation, DatabaseUpdateOperation } from "@common/abstract/_types.mjs";
import Document from "@common/abstract/document.mjs";
import type ApplicationV2 from "../applications/api/application.mjs";
import type TokenHUD from "../applications/hud/token-hud.mjs";
import { ChatLog, CompendiumDirectory, ItemDirectory, Settings } from "../applications/sidebar/tabs/_module.mjs";
import type ActorDirectory from "../applications/sidebar/tabs/actor-directory.mjs";
import type Hotbar from "../applications/ui/hotbar.mjs";
import type SceneControls from "../applications/ui/scene-controls.mjs";
import type { SceneControl } from "../applications/ui/scene-controls.mjs";
import Application from "../appv1/api/application-v1.mjs";
import Dialog from "../appv1/api/dialog-v1.mjs";
import { JournalPageSheet, JournalTextPageSheet } from "../appv1/sheets/journal-page-sheet.mjs";
import { TokenRingConfig } from "@client/canvas/placeables/tokens/_module.mjs";
import { PlaceableHUDContext } from "@client/applications/hud/placeable-hud.mjs";
import JournalSheet from "@client/appv1/sheets/journal-sheet.mjs";
import CombatConfiguration from "@client/data/combat-config.mjs";

type oldHookCallback<P extends unknown[]> = (...args: P) => boolean | void | Promise<boolean | void>;
type HookParameters<H extends string, C extends unknown[]> = [hook: H, callback: oldHookCallback<C>];

// Sequence of hooks called on world load
type HookParamsInit = HookParameters<"init", never[]>;
type HookParamsSetup = HookParameters<"setup", never[]>;
type HookParamsI18nInit = HookParameters<"i18nInit", never[]>;
type HookParamsCanvasInit = HookParameters<"canvasInit", [Canvas]>;
type HookParamsCanvasReady = HookParameters<"canvasReady", [Canvas]>;
type HookParamsReady = HookParameters<"ready", never[]>;

type HookParamsClose<T extends ApplicationV2, N extends string> = HookParameters<`close${N}`, [T]>;
type HookParamsDeleteCombat = HookParameters<"deleteCombat", [Combat, { [key: string]: unknown; }, string]>;
type HookParamsDropCanvasData = HookParameters<"dropCanvasData", [Canvas, DropCanvasData]>;
type HookParamsGetChatLogEntryContext = HookParameters<"getChatLogEntryContext", [HTMLElement, ContextMenuEntry[]]>;
type HookParamsGetSceneControlButtons = HookParameters<"getSceneControlButtons", [Record<string, SceneControl>]>;
type HookParamsHotbarDrop = HookParameters<"hotbarDrop", [Hotbar<Macro>, DropCanvasData, string]>;
type HookParamsLightingRefresh = HookParameters<"lightingRefresh", [LightingLayer]>;
type HookParamsPreCreateItem = HookParameters<
    "preCreateItem",
    [PreCreate<foundry.documents.ItemSource>, DatabaseCreateOperation<Actor | null>, string]
>;
type HooksParamsPreUpdateCombat = HookParameters<
    "preUpdateCombat",
    [Combat, object, { diff: boolean; advanceTime: number;[key: string]: unknown; }, string]
>;
type HookParamsPreUpdateToken = HookParameters<
    "preUpdateToken",
    [
        Scene,
        foundry.documents.TokenSource,
        DeepPartial<foundry.documents.TokenSource>,
        { diff: boolean;[key: string]: unknown; },
        string,
    ]
>;
type HookParamsRender<T extends Application | ApplicationV2, N extends string> = HookParameters<
    `render${N}`,
    T extends Application
    ? [T, JQuery, Awaited<ReturnType<T["getData"]>>]
    : [T, HTMLElement, T extends ApplicationV2<infer _First, infer _Second, infer U> ? U : never]
>;
type HookParamsRenderChatMessageHTML = HookParameters<"renderChatMessageHTML", [ChatMessage, string, object]>;
type HookParamsRenderChatPopout = HookParameters<
    "renderChatPopout",
    [ChatPopout, HTMLElement, ApplicationRenderContext, ApplicationRenderOptions]
>;
type HookParamsTargetToken = HookParameters<"targetToken", [User, Token<TokenDocument<Scene>>, boolean]>;
type HookParamsUpdate<T extends foundry.abstract.Document, N extends string> = HookParameters<
    `update${N}`,
    [T, Record<string, unknown>, DatabaseCreateOperation<T["parent"]>]
>;
type HookParamsUpdateWorldTime = HookParameters<"updateWorldTime", [number, number]>;
type HookParamsGetProseMirrorMenuDropDowns = HookParameters<
    "getProseMirrorMenuDropDowns",
    [foundry.prosemirror.ProseMirrorMenu, Record<string, ProseMirrorDropDownConfig>]
>;

export interface OnceHooks {
    init: () => HookReturn;
    i18nInit: () => HookReturn;
    setup: () => HookReturn;
    initializeDynamicTokenRingConfig: (ringConfig: TokenRingConfig) => HookReturn;
    initializeCombatConfiguration: (config: CombatConfiguration) => HookReturn;
    canvasConfig: (config: object) => HookReturn;
    ready: () => HookReturn;
}

export interface DefaultApplications {
    ApplicationV2: ApplicationV2;
    DialogV2: DialogV2;
    ChatLog: ChatLog;
    ChatPopout: foundry.applications.sidebar.apps.ChatPopout;
    CombatTrackerConfig: CombatTrackerConfig;
    CompendiumDirectory: CompendiumDirectory;
    ActorDirectory: ActorDirectory<Actor<null>>;
    ItemDirectory: ItemDirectory<Item<null>>;
    SceneControls: SceneControls;
    Settings: Settings;
    SettingsConfig: SettingsConfig;
    TokenHUD: TokenHUD;
    JournalSheet: JournalSheet<JournalEntry>;
    JournalPageSheet: JournalPageSheet<JournalEntryPage>;
    JournalTextPageSheet: JournalTextPageSheet<JournalEntryPage>;
    RegionLegend: foundry.applications.ui.RegionLegend;
    DocumentSheetV2: foundry.applications.api.DocumentSheetV2;
    CameraPopout: foundry.applications.apps.av.CameraPopout;
    CameraViews: foundry.applications.apps.av.CameraViews;
    CompendiumArtConfig: foundry.applications.apps.CompendiumArtConfig;
    DocumentSheetConfig: foundry.applications.apps.DocumentSheetConfig;
    FilePicker: foundry.applications.apps.FilePicker;
    ImagePopout: foundry.applications.apps.ImagePopout;
    PermissionConfig: foundry.applications.apps.PermissionConfig;
    RollResolver: foundry.applications.dice.RollResolver;
    HeadsUpDisplayContainer: foundry.applications.hud.HeadsUpDisplayContainer;
    BasePlaceableHUD: foundry.applications.hud.BasePlaceableHUD;
    AVConfig: foundry.applications.settings.menus.AVConfig;
    PrototypeTokenConfig: foundry.applications.sheets.PrototypeTokenConfig;
    ModuleManagement: foundry.applications.sidebar.apps.ModuleManagement;
    Sidebar: foundry.applications.sidebar.Sidebar;
    AbstractSidebarTab: foundry.applications.sidebar.AbstractSidebarTab;
    GamePause: foundry.applications.ui.GamePause;
    Hotbar: foundry.applications.ui.Hotbar;
    MainMenu: foundry.applications.ui.MainMenu;
    Players: foundry.applications.ui.Players;
    SceneNavigation: foundry.applications.ui.SceneNavigation;
}

export interface SystemApplications {}
export type Applications = { [K in keyof DefaultApplications | keyof SystemApplications]: K extends keyof SystemApplications ? SystemApplications[K] : K extends keyof DefaultApplications ? DefaultApplications[K] : never };

export interface ApplicationRenderContexts {
    TokenHUD: PlaceableHUDContext
}

export interface DefaultApplicationsV1 {
    ActorSheet: foundry.appv1.sheets.ActorSheet<Actor>;
    ItemSheet: foundry.appv1.sheets.ItemSheet<Item, foundry.appv1.api.DocumentSheetV1Options>;
    Dialog: Dialog;
}

export interface SystemApplicationsV1 {}
export type ApplicationsV1 = { [K in keyof DefaultApplicationsV1 | keyof SystemApplicationsV1]: K extends keyof SystemApplicationsV1 ? SystemApplicationsV1[K] : K extends keyof DefaultApplicationsV1 ? DefaultApplicationsV1[K] : never };

export type ApplicationRenderContextOf<K extends keyof Applications> = K extends keyof ApplicationRenderContexts ? ApplicationRenderContexts[K] : foundry.applications.types.ApplicationRenderContext;

export type RenderHooks = { [K in keyof Applications as `render${K}`]: (application: Applications[K], element: HTMLElement, context: ApplicationRenderContextOf<K>, options: foundry.applications.types.ApplicationRenderOptions) => HookReturn; };
export type CloseHooks = { [K in keyof Applications as `close${K}`]: (application: Applications[K]) => HookReturn; };
export type GetHeaderControls = { [K in keyof Applications as `getHeaderControls${K}`]: (application: Applications[K], controls: foundry.applications.types.ApplicationHeaderControlsEntry[]) => HookReturn; };
export type GetDocumentContextOptions = { [K in keyof Applications as `get${K}ContextOptions`]: (application: Applications[K], controls: ContextMenuEntry[]) => HookReturn; };

export type RenderHooksV1 = { [K in keyof ApplicationsV1 as `render${K}`]: (application: ApplicationsV1[K], html: JQuery, data: object) => HookReturn; };
export type CloseHooksV1 = { [K in keyof ApplicationsV1 as `close${K}`]: (application: ApplicationsV1[K], html: JQuery) => HookReturn; };
export type GetApplicationHeaderButtonsV1 = { [K in keyof ApplicationsV1 as `get${K}HeaderButtons`]: (application: ApplicationsV1[K], buttons: foundry.appv1.api.ApplicationV1HeaderButton[]) => HookReturn; };

export interface ApplicationHooks extends RenderHooks, CloseHooks, GetHeaderControls, GetDocumentContextOptions, RenderHooksV1, CloseHooksV1, GetApplicationHeaderButtonsV1 { }

export interface DefaultDocumentClasses {
    ActiveEffect: typeof foundry.documents.ActiveEffect,
    Actor: typeof Actor<null>;
    ActorDelta: typeof foundry.documents.ActorDelta<TokenDocument | null>,
    Adventure: typeof foundry.documents.Adventure,
    AmbientLight: typeof foundry.documents.AmbientLightDocument<Scene | null>,
    AmbientSound: typeof foundry.documents.AmbientSoundDocument<Scene | null>,
    Card: typeof foundry.documents.Card<foundry.documents.Cards>;
    Cards: typeof foundry.documents.Cards,
    ChatMessage: typeof ChatMessage<User | null>;
    Combat: typeof Combat;
    Combatant: typeof foundry.documents.Combatant;
    CombatantGroup: typeof foundry.documents.CombatantGroup,
    Drawing: typeof foundry.documents.DrawingDocument,
    FogExploration: typeof foundry.documents.FogExploration,
    Item: typeof Item<null>;
    JournalEntry: typeof foundry.documents.JournalEntry,
    // JournalEntryCategory: foundry.documents.JournalEntryCategory,
    JournalEntryPage: typeof foundry.documents.JournalEntryPage,
    Macro: typeof foundry.documents.Macro,
    MeasuredTemplate: typeof foundry.documents.MeasuredTemplateDocument,
    Note: typeof foundry.documents.NoteDocument<Scene | null>,
    Playlist: typeof foundry.documents.Playlist,
    PlaylistSound: typeof foundry.documents.PlaylistSound,
    Region: typeof foundry.documents.RegionDocument,
    RegionBehavior: typeof foundry.documents.RegionBehavior,
    RollTable: typeof foundry.documents.RollTable,
    Scene: typeof foundry.documents.Scene,
    Setting: typeof foundry.documents.Setting,
    TableResult: typeof foundry.documents.TableResult,
    Tile: typeof foundry.documents.TileDocument<Scene | null>;
    Token: typeof TokenDocument;
    User: typeof foundry.documents.User,
    Wall: typeof foundry.documents.WallDocument,
}

export interface SystemDocumentClasses {}
export type DocumentClasses = { [K in keyof DefaultDocumentClasses]: K extends keyof SystemDocumentClasses ? SystemDocumentClasses[K] : DefaultDocumentClasses[K] };

export type Documents = {
    [K in keyof DocumentClasses]: InstanceType<DocumentClasses[K]>;
};

export type PreCreateDocumentHooks =
    { [K in keyof Documents as `preCreate${K}`]: (document: Documents[K], data: PreCreate<Documents[K]["_source"]>, options: Partial<DatabaseCreateOperation<Documents[K]["parent"]>>, userId: string) => CancellableHookReturn };
export type CreateDocumentHooks =
    { [K in keyof Documents as `create${K}`]: (document: Documents[K], options: Partial<DatabaseCreateOperation<Documents[K]["parent"]>>, userId: string) => HookReturn };
export type PreUpdateDocumentHooks =
    { [K in keyof Documents as `preUpdate${K}`]: (document: Documents[K], changed: Record<string, unknown>, options: Partial<DatabaseUpdateOperation<Documents[K]["parent"]>>, userId: string) => CancellableHookReturn };
export type UpdateDocumentHooks =
    { [K in keyof Documents as `update${K}`]: (document: Documents[K], changed: Record<string, unknown>, options: Partial<DatabaseUpdateOperation<Documents[K]["parent"]>>, userId: string) => HookReturn };
export type PreDeleteDocumentHooks =
    { [K in keyof Documents as `preDelete${K}`]: (document: Documents[K], options: Partial<DatabaseDeleteOperation<Documents[K]["parent"]>>, userId: string) => CancellableHookReturn };
export type DeleteDocumentHooks =
    { [K in keyof Documents as `delete${K}`]: (document: Documents[K], options: Partial<DatabaseDeleteOperation<Documents[K]["parent"]>>, userId: string) => HookReturn };

export interface DocumentHooks extends PreCreateDocumentHooks, CreateDocumentHooks, PreUpdateDocumentHooks, UpdateDocumentHooks, PreDeleteDocumentHooks, DeleteDocumentHooks { }

export interface CanvasGroups {
    CanvasVisibility: foundry.canvas.groups.CanvasVisibility;
    EffectsCanvasGroup: foundry.canvas.groups.EffectsCanvasGroup;
    EnvironmentCanvasGroup: foundry.canvas.groups.EnvironmentCanvasGroup;
    OverlayCanvasGroup: foundry.canvas.groups.OverlayCanvasGroup;
    PrimaryCanvasGroup: foundry.canvas.groups.PrimaryCanvasGroup;
    RenderedCanvasGroup: foundry.canvas.groups.RenderedCanvasGroup;

    HiddenCanvasGroup: foundry.canvas.groups.HiddenCanvasGroup;
    InterfaceCanvasGroup: foundry.canvas.groups.InterfaceCanvasGroup;
}

export type DrawGroup = { [K in keyof CanvasGroups as `draw${K}`]: (group: CanvasGroups[K]) => HookReturn };
export type TearDownGroup = { [K in keyof CanvasGroups as `tearDown${K}`]: (group: CanvasGroups[K]) => HookReturn };

interface CanvasLayers {
    ControlsLayer: foundry.canvas.layers.ControlsLayer;
    CanvasBackgroundAlterationEffects: foundry.canvas.layers.CanvasBackgroundAlterationEffects;
    CanvasColorationEffects: foundry.canvas.layers.CanvasColorationEffects;
    CanvasDarknessEffects: foundry.canvas.layers.CanvasDarknessEffects;
    CanvasIlluminationEffects: foundry.canvas.layers.CanvasIlluminationEffects;
    GridLayer: foundry.canvas.layers.GridLayer;

    DrawingsLayer: foundry.canvas.layers.DrawingsLayer;
    LightingLayer: foundry.canvas.layers.LightingLayer;
    NotesLayer: foundry.canvas.layers.NotesLayer;
    WallsLayer: foundry.canvas.layers.WallsLayer;
    TokenLayer: foundry.canvas.layers.TokenLayer;
    RegionLayer: foundry.canvas.layers.RegionLayer;
    SoundsLayer: foundry.canvas.layers.SoundsLayer;
    TemplateLayer: foundry.canvas.layers.TemplateLayer;
    TilesLayer: foundry.canvas.layers.TilesLayer;
}

export type DrawLayer = { [K in keyof CanvasLayers as `draw${K}`]: (layer: CanvasLayers[K]) => HookReturn };
export type TearDownLayer = { [K in keyof CanvasLayers as `tearDown${K}`]: (layer: CanvasLayers[K]) => HookReturn };

export type InteractionLayers = { [K in keyof CanvasLayers as CanvasLayers[K] extends foundry.canvas.layers.InteractionLayer ? K : never]: CanvasLayers[K] };

export type ActivateLayer = { [K in keyof InteractionLayers as `activate${K}`]: (layer: foundry.canvas.layers.InteractionLayer) => HookReturn };
export type DeactivateLayer = { [K in keyof InteractionLayers as `deactivate${K}`]: (layer: foundry.canvas.layers.InteractionLayer) => HookReturn };

export interface CanvasHooks extends
    DrawGroup,
    TearDownGroup,
    DrawLayer,
    TearDownLayer,
    ActivateLayer,
    DeactivateLayer { }

export interface PlaceableObjects {
    Drawing: foundry.canvas.placeables.Drawing;
    Note: foundry.canvas.placeables.Note;
    Region: foundry.canvas.placeables.Region;
    Tile: foundry.canvas.placeables.Tile;
    Token: foundry.canvas.placeables.Token;
    MeasuredTemplate: foundry.canvas.placeables.MeasuredTemplate;
    Wall: foundry.canvas.placeables.Wall;
    AmbientLight: foundry.canvas.placeables.AmbientLight;
    AmbientSound: foundry.canvas.placeables.AmbientSound;
}

export type ControlObject = { [K in keyof PlaceableObjects as `control${K}`]: (object: PlaceableObjects[K], controlled: boolean) => HookReturn };
export type DestroyObject = { [K in keyof PlaceableObjects as `destroy${K}`]: (object: PlaceableObjects[K]) => HookReturn };
export type DrawObject = { [K in keyof PlaceableObjects as `draw${K}`]: (object: PlaceableObjects[K]) => HookReturn };
export type HoverObject = { [K in keyof PlaceableObjects as `hover${K}`]: (object: PlaceableObjects[K], hovered: boolean) => HookReturn };
export type RefreshObject = { [K in keyof PlaceableObjects as `refresh${K}`]: (object: PlaceableObjects[K]) => HookReturn };
export type PastePlaceableObject = { [K in keyof PlaceableObjects as `place${K}`]: (objects: PlaceableObjects[K][], data: object[], options: { cut: boolean; }) => HookReturn };

interface PlaceableObjectHooks extends
    ControlObject,
    DestroyObject,
    DrawObject,
    HoverObject,
    RefreshObject,
    PastePlaceableObject { }

export interface DynamicHooks extends
    ApplicationHooks,
    DocumentHooks,
    CanvasHooks,
    PlaceableObjectHooks { }

export interface StaticHooks extends OnceHooks {
    rtcSettingsChanged: (settings: foundry.av.AVSettings, changed: object) => HookReturn;
    applyActiveEffect: (actor: Actor, change: foundry.documents.types.EffectChangeData, current: any, delta: any, changes: object) => HookReturn;

    modifyTokenAttribute: (data: { attribute: string; isData: boolean; isBar: boolean; value: number; }, updates: object, actor: Actor) => HookReturn;

    // dropActorSheetData: (actor: Actor, sheet: foundry.applications.sheets.ActorSheetV2<Actor>, data: object) => HookReturn;

    importAdventure: (adventure: foundry.documents.Adventure, formData: object, created: Record<string, Document[]>, updated: Record<string, Document[]>) => HookReturn;
    preImportAdventure: (adventure: foundry.documents.Adventure, formData: object, toCreate: Record<string, Document[]>, toUpdate: Record<string, Document[]>) => CancellableHookReturn;

    globalVolumeChanged: (volume: number) => HookReturn;

    canvasConfig: (config: object) => HookReturn;
    canvasDraw: (canvas: foundry.canvas.Canvas) => HookReturn;
    canvasInit: (canvas: foundry.canvas.Canvas) => HookReturn;
    canvasPan: (canvas: foundry.canvas.Canvas, position: foundry.CanvasViewPosition) => HookReturn;
    canvasReady: (canvas: foundry.canvas.Canvas) => HookReturn;
    canvasTearDown: (canvas: foundry.canvas.Canvas) => HookReturn;

    dropCanvasData: (canvas: Canvas, data: DropCanvasData, event: DragEvent) => CancellableHookReturn;
    highlightObjects: (active: boolean) => HookReturn;
    initializeEdges: () => HookReturn;

    initializeVisionMode: (visibility: foundry.canvas.groups.CanvasVisibility) => HookReturn;
    initializeVisionSources: (sources: foundry.utils.Collection<string, foundry.canvas.sources.PointVisionSource<foundry.canvas.placeables.AmbientLight | Token>>) => HookReturn;
    sightRefresh: (visibility: foundry.canvas.groups.CanvasVisibility) => HookReturn;
    visibilityRefresh: (visibility: foundry.canvas.groups.CanvasVisibility) => HookReturn;

    dealCards: (origin: foundry.documents.Cards, destinations: foundry.documents.Cards[], context: { action: string; fromDelete: object[]; fromUpdate: object[]; toCreate: object[]; }) => HookReturn;
    passCards: (origin: foundry.documents.Cards, destination: foundry.documents.Cards, context: { action: string; fromDelete: object[]; fromUpdate: object[]; toCreate: object[]; toUpdate: object[]; }) => HookReturn;
    returnCards: (origin: foundry.documents.Cards, returned: foundry.documents.Card[], context: { fromDelete: object[]; toUpdate: Record<string, object[]>; }) => HookReturn;

    chatBubbleHTML: (token: Token, html: HTMLElement, message: string, options: foundry.canvas.animation.ChatBubbleOptions) => CancellableHookReturn;

    chatInput: (event: KeyboardEvent, options: { recordPending: boolean; }) => CancellableHookReturn;
    chatMessage: (chatLog: ChatLog, message: string, chatData: { user: string; speaker: foundry.documents.ChatSpeakerData; }) => HookReturn;
    renderChatInput: (app: ChatLog, element: Record<string, HTMLElement>, context: { previousParent: HTMLElement; }) => HookReturn;

    renderChatMessageHTML: (message: Documents['ChatMessage'], html: HTMLElement, context: foundry.documents.ChatMessageSource) => HookReturn;

    clientSettingChanged: (key: string, value: any, options: object) => HookReturn;

    combatRound: (combat: Combat, updateData: { round: number; turn: number; }, updateOptions: { advanceTime: number; direction: number; }) => HookReturn;
    combatStart: (combat: Combat, updateData: { round: number; turn: number; }) => HookReturn;
    combatTurn: (combat: Combat, updateData: { round: number; turn: number; }, updateOptions: { advanceTime: number; direction: number; }) => HookReturn;
    combatTurnChange: (combat: Combat, prior: foundry.documents.types.CombatHistoryData, current: foundry.documents.types.CombatHistoryData) => HookReturn;

    updateCompendium: (pack: foundry.documents.collections.CompendiumCollection, documents: Document[], options: object, userId: string) => HookReturn;

    applyCompendiumArt: (documentClass: typeof Document, source: object, pack: foundry.documents.collections.CompendiumCollection, art: foundry.helpers.CompendiumArtInfo) => HookReturn;

    initializeLightSources: (group: foundry.canvas.groups.EffectsCanvasGroup) => HookReturn;
    initializePriorityLightSources: (group: foundry.canvas.groups.EffectsCanvasGroup) => HookReturn;
    lightingRefresh: (group: foundry.canvas.groups.EffectsCanvasGroup) => HookReturn;

    configureCanvasEnvironment: (config: CanvasEnvironmentConfig) => HookReturn;
    initializeCanvasEnvironment: () => HookReturn;

    error: (location: string, error: Error, data: object) => HookReturn;
    hotReload: (data: foundry.HotReloadData) => HookReturn;
    pauseGame: (paused: boolean, options: { broadcoast?: boolean, userId?: string; }) => HookReturn;
    streamReady: () => HookReturn;
    updateWorldTime: (worldTime: number, dt: number, options: object, userId: string) => HookReturn;

    hotbarDrop: (hotbar: Hotbar, data: object, slot: number) => CancellableHookReturn;

    activateCanvasLayer: (layer: foundry.canvas.layers.InteractionLayer) => HookReturn;

    activateNote: (note: foundry.canvas.placeables.Note, options: object) => HookReturn;

    createProseMirrorEditor: (uuid: string, plugins: Record<string, foundry.prosemirror.ProseMirrorPlugin>, options: { state: EditorState; }) => HookReturn;

    getProseMirrorMenuDropDowns: (menu: foundry.prosemirror.ProseMirrorMenu, config: { format: ProseMirrorDropDownConfig; fonts: ProseMirrorDropDownConfig; }) => HookReturn;
    getProseMirrorMenuItems: (menu: foundry.prosemirror.ProseMirrorMenu, config: ProseMirrorMenuItem[]) => HookReturn;

    initializeRenderedEffectSourceShaders: (source: foundry.canvas.sources.RenderedEffectSource<foundry.canvas.placeables.PlaceableObject>) => HookReturn;

    // TODO dropRollTableSheetData: (table: foundry.documents.RollTable, sheet: foundry.applications.sheets.RollTableConfig, data: object) => HookReturn;

    getSceneControlButtons: (controls: Record<string, SceneControl>) => HookReturn;

    collapseSceneNavigation: (sceneNavigation: foundry.applications.ui.SceneNavigation, collapsed: boolean) => HookReturn;

    changeSidebarTab: (app: foundry.applications.sidebar.AbstractSidebarTab) => HookReturn;
    collapseSidebar: (sidebar: foundry.applications.sidebar.Sidebar, collapsed: boolean) => HookReturn;

    applyTokenStatusEffect: (token: foundry.canvas.placeables.Token<TokenDocument<Scene>>, statusId: string, active: boolean) => HookReturn;
    targetToken: (user: User, token: foundry.canvas.placeables.Token<TokenDocument<Scene>>, targeted: boolean) => HookReturn;

    moveToken: (document: TokenDocument, movement: DeepReadonly<foundry.documents.types.TokenMovementOperation>, operation: Partial<DatabaseUpdateOperation<TokenDocument>>, user: User) => HookReturn;
    pauseToken: (document: TokenDocument) => HookReturn;
    preMoveToken: (document: TokenDocument, movement: DeepReadonly<foundry.documents.types.TokenMovementOperation>, operation: Partial<DatabaseUpdateOperation<TokenDocument>>) => CancellableHookReturn;
    recordToken: (document: TokenDocument) => HookReturn;
    stopToken: (document: TokenDocument) => HookReturn;

    userConnected: (user: User, connected: boolean) => HookReturn;

    initializeWeatherEffects: (weatherEffect: foundry.canvas.layers.WeatherEffects, weatherEffectsConfig: object) => HookReturn;
}

export interface AllHooks extends
    OnceHooks,
    StaticHooks,
    DynamicHooks { }

export interface HookedFunction<H extends HookName> {
    fn: HookCallback<H>;
    hook: H;
    id: number;
    once: boolean;
}

declare global {
    type HookName = keyof AllHooks;
    type HookCallback<H extends HookName> = AllHooks[H];
    type HookParams<H extends HookName> = Parameters<HookCallback<H>>;
    type Hook<H extends HookName> = [H, HookCallback<H>];
    type HookReturn = void | Promise<void>;
    type CancellableHookReturn = HookReturn | boolean;

    class Hooks {
        static get events(): { [H in HookName]: HookedFunction<H>[] | undefined }

        /**
         * Register a callback handler which should be triggered when a hook is triggered.
         *
         * @param hook The unique name of the hooked event
         * @param fn   The callback function which should be triggered when the hook event occurs
         */
        static on<K extends HookName>(hook: K, fn: HookCallback<K>): number;

        /**
         * Register a callback handler for an event which is only triggered once the first time the event occurs.
         * After a "once" hook is triggered the hook is automatically removed.
         *
         * @param hook  The unique name of the hooked event
         * @param fn    The callback function which should be triggered when the hook event occurs
         */
        static once<K extends HookName>(hook: K, fn: HookCallback<K>): number;
        /**
         * Unregister a callback handler for a particular hook event
         *
         * @param hook  The unique name of the hooked event
         * @param fn    The function that should be removed from the set of hooked callbacks
         */
        static off(hook: HookName, fn: number | ((...args: any[]) => any)): void;

        /**
         * Call all hook listeners in the order in which they were registered
         * Hooks called this way can not be handled by returning false and will always trigger every hook callback.
         *
         * @param hook  The hook being triggered
         * @param args  Arguments passed to the hook callback functions
         */
        static callAll<K extends HookName>(hook: K, ...args: HookParams<K>): boolean;

        /**
         * Call hook listeners in the order in which they were registered.
         * Continue calling hooks until either all have been called or one returns `false`.
         *
         * Hook listeners which return `false` denote that the original event has been adequately handled and no further
         * hooks should be called.
         *
         * @param hook  The hook being triggered
         * @param args  Arguments passed to the hook callback functions
         */
        static call<K extends HookName>(hook: K, ...args: HookParams<K>): boolean;
    }
}

export interface DropCanvasData<T extends string = string, D extends object = object> {
    type?: T;
    data?: D extends Document ? D["_source"] : D;
    uuid?: DocumentUUID;
    id?: string;
    pack?: string;
    x: number;
    y: number;
    documentName?: string;
    actorId?: string;
    tokenId?: string;
}

export default Hooks;
