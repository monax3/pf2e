import { EditorState } from "prosemirror-state";
import type { DialogV2 } from "@client/applications/api/_module.mjs";
import type { CombatTrackerConfig } from "@client/applications/apps/_module.mjs";
import SettingsConfig from "@client/applications/settings/config.mjs";
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
import { DocumentUUID } from "@client/utils/helpers.mjs";
import { DatabaseCreateOperation, type DatabaseDeleteOperation, type DatabaseUpdateOperation } from "@common/abstract/_types.mjs";
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
import type { TokenRingConfig } from "@client/canvas/placeables/tokens/_module.mjs";
import type { PlaceableHUDContext } from "@client/applications/hud/placeable-hud.mjs";

type HookCallback<P extends unknown[]> = (...args: P) => boolean | void | Promise<boolean | void>;
type HookParameters<H extends string, C extends unknown[]> = [hook: H, callback: HookCallback<C>];

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

declare global {
    type HookName = keyof Hooks.AllHooks;
    type HookCallback<H extends HookName> = Hooks.AllHooks[H];
    type HookParams<H extends HookName> = Parameters<HookCallback<H>>;
    type Hook<H extends HookName> = [H, HookCallback<H>];

    namespace Hooks {
        type Return = void | Promise<void>;
        type CancellableReturn = Return | boolean;

        interface OnceHooks {
            init: () => Return;
            i18nInit: () => Return;
            setup: () => Return;
            initializeDynamicTokenRingConfig: (ringConfig: foundry.canvas.placeables.tokens.TokenRingConfig) => Return;
            initializeCombatConfiguration: (config: foundry.data.CombatConfiguration) => Return;
            canvasConfig: (config: object) => Return;
            ready: () => Return;
        }

        interface Applications {
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
            JournalPageSheet: JournalPageSheet<JournalEntryPage>;
            JournalTextPageSheet: JournalTextPageSheet<JournalEntryPage>;
            RegionLegend: foundry.applications.ui.RegionLegend;
            Pause: foundry.applications.ui.GamePause;
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

        interface ApplicationRenderContexts {
            TokenHUD: PlaceableHUDContext
        }

        interface ApplicationsV1 {
            ActorSheet: foundry.appv1.sheets.ActorSheet<Actor>;
            ItemSheet: foundry.appv1.sheets.ItemSheet<Item, foundry.appv1.api.DocumentSheetV1Options>;
            Dialog: Dialog;
        }

        type ApplicationRenderContext<K extends keyof Applications> = K extends keyof ApplicationRenderContexts ? ApplicationRenderContexts[K] : foundry.applications.types.ApplicationRenderContext;

        type RenderHooks = { [K in keyof Applications as `render${K}`]: (application: Applications[K], element: HTMLElement, context: ApplicationRenderContext<K>, options: foundry.applications.types.ApplicationRenderOptions) => Hooks.Return; };
        type CloseHooks = { [K in keyof Applications as `close${K}`]: (application: Applications[K]) => Hooks.Return; };
        type GetHeaderControls = { [K in keyof Applications as `getHeaderControls${K}`]: (application: Applications[K], controls: foundry.applications.types.ApplicationHeaderControlsEntry[]) => Hooks.Return; };
        type GetDocumentContextOptions = { [K in keyof Applications as `get${K}ContextOptions`]: (application: Applications[K], controls: ContextMenuEntry[]) => Hooks.Return; };

        type RenderHooksV1 = { [K in keyof ApplicationsV1 as `render${K}`]: (application: ApplicationsV1[K], html: JQuery, data: object) => Hooks.Return; };
        type CloseHooksV1 = { [K in keyof ApplicationsV1 as `close${K}`]: (application: ApplicationsV1[K], html: JQuery) => Hooks.Return; };
        type GetApplicationHeaderButtonsV1 = { [K in keyof ApplicationsV1 as `get${K}HeaderButtons`]: (application: ApplicationsV1[K], buttons: foundry.appv1.api.ApplicationV1HeaderButton[]) => Hooks.Return; };

        interface ApplicationHooks extends RenderHooks, CloseHooks, GetHeaderControls, GetDocumentContextOptions, RenderHooksV1, CloseHooksV1, GetApplicationHeaderButtonsV1 { }

        interface DocumentClasses {
            Actor: typeof Actor;
            Card: typeof foundry.documents.Card<foundry.documents.Cards>;
            ChatMessage: typeof ChatMessage;
            Token: typeof TokenDocument;
            Combat: typeof Combat;
            Item: typeof Item;
            Combatant: typeof foundry.documents.Combatant;
            Tile: typeof foundry.documents.TileDocument<Scene | null>;
            ActiveEffect: typeof foundry.documents.ActiveEffect,
            ActorDelta: typeof foundry.documents.ActorDelta<TokenDocument | null>,
            Adventure: typeof foundry.documents.Adventure,
            AmbientLight: typeof foundry.documents.AmbientLightDocument<Scene | null>,
            AmbientSound: typeof foundry.documents.AmbientSoundDocument<Scene | null>,
            Cards: typeof foundry.documents.Cards,
            CombatantGroup: typeof foundry.documents.CombatantGroup,
            Drawing: typeof foundry.documents.DrawingDocument,
            FogExploration: typeof foundry.documents.FogExploration,
            Folder: typeof foundry.documents.Folder,
            JournalEntry: typeof foundry.documents.JournalEntry,

            // JournalEntryCategory: foundry.documents.JournalEntryCategory,

            JournalEntryPage: typeof foundry.documents.JournalEntryPage,
            Macro: typeof foundry.documents.Macro,
            MeasuredTemplate: typeof foundry.documents.MeasuredTemplateDocument,
            Note: typeof foundry.documents.NoteDocument<Scene | null>,
            Playlist: typeof foundry.documents.Playlist,
            PlaylistSound: typeof foundry.documents.PlaylistSound,
            RollTable: typeof foundry.documents.RollTable,
            Scene: typeof foundry.documents.Scene,
            Region: typeof foundry.documents.RegionDocument,
            RegionBehavior: typeof foundry.documents.RegionBehavior,
            Setting: typeof foundry.documents.Setting,
            TableResult: typeof foundry.documents.TableResult,
            User: typeof foundry.documents.User,
            Wall: typeof foundry.documents.WallDocument,
        }

        type Documents = {
            [K in keyof DocumentClasses]: InstanceType<DocumentClasses[K]>;
        };

        type PreCreateDocumentHooks =
            { [K in keyof Documents as `preCreate${K}`]: (document: Documents[K], data: PreCreate<Documents[K]["_source"]>, options: Partial<DatabaseCreateOperation<Documents[K]["parent"]>>, userId: string) => CancellableReturn };
        type CreateDocumentHooks =
            { [K in keyof Documents as `create${K}`]: (document: Documents[K], options: Partial<DatabaseCreateOperation<Documents[K]["parent"]>>, userId: string) => Return };
        type PreUpdateDocumentHooks =
            { [K in keyof Documents as `preUpdate${K}`]: (document: Documents[K], changed: Record<string, unknown>, options: Partial<DatabaseUpdateOperation<Documents[K]["parent"]>>, userId: string) => CancellableReturn };
        type UpdateDocumentHooks =
            { [K in keyof Documents as `update${K}`]: (document: Documents[K], changed: Record<string, unknown>, options: Partial<DatabaseUpdateOperation<Documents[K]["parent"]>>, userId: string) => Return };
        type PreDeleteDocumentHooks =
            { [K in keyof Documents as `preDelete${K}`]: (document: Documents[K], options: Partial<DatabaseDeleteOperation<Documents[K]["parent"]>>, userId: string) => CancellableReturn };
        type DeleteDocumentHooks =
            { [K in keyof Documents as `delete${K}`]: (document: Documents[K], options: Partial<DatabaseDeleteOperation<Documents[K]["parent"]>>, userId: string) => Return };

        interface DocumentHooks extends PreCreateDocumentHooks, CreateDocumentHooks, PreUpdateDocumentHooks, UpdateDocumentHooks, PreDeleteDocumentHooks, DeleteDocumentHooks { }

        interface CanvasGroups {
            CanvasVisibility: foundry.canvas.groups.CanvasVisibility;
            EffectsCanvasGroup: foundry.canvas.groups.EffectsCanvasGroup;
            EnvironmentCanvasGroup: foundry.canvas.groups.EnvironmentCanvasGroup;
            OverlayCanvasGroup: foundry.canvas.groups.OverlayCanvasGroup;
            PrimaryCanvasGroup: foundry.canvas.groups.PrimaryCanvasGroup;
            RenderedCanvasGroup: foundry.canvas.groups.RenderedCanvasGroup;

            HiddenCanvasGroup: foundry.canvas.groups.HiddenCanvasGroup;
            InterfaceCanvasGroup: foundry.canvas.groups.InterfaceCanvasGroup;
        }

        type DrawGroup = { [K in keyof CanvasGroups as `draw${K}`]: (group: CanvasGroups[K]) => Hooks.Return };
        type TearDownGroup = { [K in keyof CanvasGroups as `tearDown${K}`]: (group: CanvasGroups[K]) => Hooks.Return };

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

        type DrawLayer = { [K in keyof CanvasLayers as `draw${K}`]: (layer: CanvasLayers[K]) => Hooks.Return };
        type TearDownLayer = { [K in keyof CanvasLayers as `tearDown${K}`]: (layer: CanvasLayers[K]) => Hooks.Return };

        type InteractionLayers = { [K in keyof CanvasLayers as CanvasLayers[K] extends foundry.canvas.layers.InteractionLayer ? K : never]: CanvasLayers[K] };

        type ActivateLayer = { [K in keyof InteractionLayers as `activate${K}`]: (layer: foundry.canvas.layers.InteractionLayer) => Hooks.Return };
        type DeactivateLayer = { [K in keyof InteractionLayers as `deactivate${K}`]: (layer: foundry.canvas.layers.InteractionLayer) => Hooks.Return };

        interface CanvasHooks extends
            DrawGroup,
            TearDownGroup,
            DrawLayer,
            TearDownLayer,
            ActivateLayer,
            DeactivateLayer { }

        interface PlaceableObjects {
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

        type ControlObject = { [K in keyof PlaceableObjects as `control${K}`]: (object: PlaceableObjects[K], controlled: boolean) => Hooks.Return };
        type DestroyObject = { [K in keyof PlaceableObjects as `destroy${K}`]: (object: PlaceableObjects[K]) => Hooks.Return };
        type DrawObject = { [K in keyof PlaceableObjects as `draw${K}`]: (object: PlaceableObjects[K]) => Hooks.Return };
        type HoverObject = { [K in keyof PlaceableObjects as `hover${K}`]: (object: PlaceableObjects[K], hovered: boolean) => Hooks.Return };
        type RefreshObject = { [K in keyof PlaceableObjects as `refresh${K}`]: (object: PlaceableObjects[K]) => Hooks.Return };
        type PastePlaceableObject = { [K in keyof PlaceableObjects as `place${K}`]: (objects: PlaceableObjects[K][], data: object[], options: { cut: boolean; }) => Hooks.Return };

        interface PlaceableObjectHooks extends
            Hooks.ControlObject,
            Hooks.DestroyObject,
            Hooks.DrawObject,
            Hooks.HoverObject,
            Hooks.RefreshObject,
            Hooks.PastePlaceableObject { }

        interface DynamicHooks extends
            ApplicationHooks,
            DocumentHooks,
            CanvasHooks,
            PlaceableObjectHooks { }

        interface StaticHooks extends OnceHooks {
            rtcSettingsChanged: (settings: foundry.av.AVSettings, changed: object) => Return;
            applyActiveEffect: (actor: Actor, change: foundry.documents.types.EffectChangeData, current: any, delta: any, changes: object) => Return;

            modifyTokenAttribute: (data: { attribute: string; isData: boolean; isBar: boolean; value: number; }, updates: object, actor: Actor) => Return;

            // dropActorSheetData: (actor: Actor, sheet: foundry.applications.sheets.ActorSheetV2<Actor>, data: object) => Return;

            importAdventure: (adventure: foundry.documents.Adventure, formData: object, created: Record<string, Document[]>, updated: Record<string, Document[]>) => Return;
            preImportAdventure: (adventure: foundry.documents.Adventure, formData: object, toCreate: Record<string, Document[]>, toUpdate: Record<string, Document[]>) => CancellableReturn;

            globalVolumeChanged: (volume: number) => Return;

            canvasConfig: (config: object) => Return;
            canvasDraw: (canvas: foundry.canvas.Canvas) => Return;
            canvasInit: (canvas: foundry.canvas.Canvas) => Return;
            canvasPan: (canvas: foundry.canvas.Canvas, position: foundry.CanvasViewPosition) => Return;
            canvasReady: (canvas: foundry.canvas.Canvas) => Return;
            canvasTearDown: (canvas: foundry.canvas.Canvas) => Return;

            dropCanvasData: (canvas: Canvas, data: DropCanvasData, event: DragEvent) => CancellableReturn;
            highlightObjects: (active: boolean) => Return;
            initializeEdges: () => Return;

            initializeVisionMode: (visibility: foundry.canvas.groups.CanvasVisibility) => Return;
            initializeVisionSources: (sources: foundry.utils.Collection<string, foundry.canvas.sources.PointVisionSource<foundry.canvas.placeables.AmbientLight | Token>>) => Return;
            sightRefresh: (visibility: foundry.canvas.groups.CanvasVisibility) => Return;
            visibilityRefresh: (visibility: foundry.canvas.groups.CanvasVisibility) => Return;

            dealCards: (origin: foundry.documents.Cards, destinations: foundry.documents.Cards[], context: { action: string; fromDelete: object[]; fromUpdate: object[]; toCreate: object[]; }) => Return;
            passCards: (origin: foundry.documents.Cards, destination: foundry.documents.Cards, context: { action: string; fromDelete: object[]; fromUpdate: object[]; toCreate: object[]; toUpdate: object[]; }) => Return;
            returnCards: (origin: foundry.documents.Cards, returned: foundry.documents.Card[], context: { fromDelete: object[]; toUpdate: Record<string, object[]>; }) => Return;

            chatBubbleHTML: (token: Token, html: HTMLElement, message: string, options: foundry.canvas.animation.ChatBubbleOptions) => CancellableReturn;

            chatInput: (event: KeyboardEvent, options: { recordPending: boolean; }) => CancellableReturn;
            chatMessage: (chatLog: ChatLog, message: string, chatData: { user: string; speaker: foundry.documents.ChatSpeakerData; }) => Return;
            renderChatInput: (app: ChatLog, element: Record<string, HTMLElement>, context: { previousParent: HTMLElement; }) => Return;

            renderChatMessageHTML: (message: ChatMessage, html: HTMLElement, context: foundry.documents.ChatMessageSource) => Return;

            clientSettingChanged: (key: string, value: any, options: object) => Return;

            combatRound: (combat: Combat, updateData: { round: number; turn: number; }, updateOptions: { advanceTime: number; direction: number; }) => Return;
            combatStart: (combat: Combat, updateData: { round: number; turn: number; }) => Return;
            combatTurn: (combat: Combat, updateData: { round: number; turn: number; }, updateOptions: { advanceTime: number; direction: number; }) => Return;
            combatTurnChange: (combat: Combat, prior: foundry.documents.types.CombatHistoryData, current: foundry.documents.types.CombatHistoryData) => Return;

            updateCompendium: (pack: foundry.documents.collections.CompendiumCollection, documents: Document[], options: object, userId: string) => Return;

            applyCompendiumArt: (documentClass: typeof Document, source: object, pack: foundry.documents.collections.CompendiumCollection, art: foundry.helpers.CompendiumArtInfo) => Return;

            initializeLightSources: (group: foundry.canvas.groups.EffectsCanvasGroup) => Return;
            initializePriorityLightSources: (group: foundry.canvas.groups.EffectsCanvasGroup) => Return;
            lightingRefresh: (group: foundry.canvas.groups.EffectsCanvasGroup) => Return;

            configureCanvasEnvironment: (config: CanvasEnvironmentConfig) => Return;
            initializeCanvasEnvironment: () => Return;

            error: (location: string, error: Error, data: object) => Return;
            hotReload: (data: foundry.HotReloadData) => Return;
            pauseGame: (paused: boolean, options: { broadcoast?: boolean, userId?: string; }) => Return;
            streamReady: () => Return;
            updateWorldTime: (worldTime: number, dt: number, options: object, userId: string) => Return;

            hotbarDrop: (hotbar: Hotbar, data: object, slot: number) => CancellableReturn;

            activateCanvasLayer: (layer: foundry.canvas.layers.InteractionLayer) => Return;

            activateNote: (note: foundry.canvas.placeables.Note, options: object) => Return;

            createProseMirrorEditor: (uuid: string, plugins: Record<string, foundry.prosemirror.ProseMirrorPlugin>, options: { state: EditorState; }) => Return;

            getProseMirrorMenuDropDowns: (menu: foundry.prosemirror.ProseMirrorMenu, config: { format: ProseMirrorDropDownConfig; fonts: ProseMirrorDropDownConfig; }) => Return;
            getProseMirrorMenuItems: (menu: foundry.prosemirror.ProseMirrorMenu, config: ProseMirrorMenuItem[]) => Return;

            initializeRenderedEffectSourceShaders: (source: foundry.canvas.sources.RenderedEffectSource<foundry.canvas.placeables.PlaceableObject>) => Return;

            // TODO dropRollTableSheetData: (table: foundry.documents.RollTable, sheet: foundry.applications.sheets.RollTableConfig, data: object) => Return;

            getSceneControlButtons: (controls: Record<string, SceneControl>) => Return;

            collapseSceneNavigation: (sceneNavigation: foundry.applications.ui.SceneNavigation, collapsed: boolean) => Return;

            changeSidebarTab: (app: foundry.applications.sidebar.AbstractSidebarTab) => Return;
            collapseSidebar: (sidebar: foundry.applications.sidebar.Sidebar, collapsed: boolean) => Return;

            applyTokenStatusEffect: (token: foundry.canvas.placeables.Token<TokenDocument<Scene>>, statusId: string, active: boolean) => Return;
            targetToken: (user: User, token: foundry.canvas.placeables.Token<TokenDocument<Scene>>, targeted: boolean) => Return;

            moveToken: (document: TokenDocument, movement: DeepReadonly<foundry.documents.types.TokenMovementOperation>, operation: Partial<DatabaseUpdateOperation<TokenDocument>>, user: User) => Return;
            pauseToken: (document: TokenDocument) => Return;
            preMoveToken: (document: TokenDocument, movement: DeepReadonly<foundry.documents.types.TokenMovementOperation>, operation: Partial<DatabaseUpdateOperation<TokenDocument>>) => CancellableReturn;
            recordToken: (document: TokenDocument) => Return;
            stopToken: (document: TokenDocument) => Return;

            userConnected: (user: User, connected: boolean) => Return;

            initializeWeatherEffects: (weatherEffect: foundry.canvas.layers.WeatherEffects, weatherEffectsConfig: object) => Return;
        }

        interface AllHooks extends
            Hooks.OnceHooks,
            Hooks.StaticHooks,
            Hooks.DynamicHooks { }
    }

    class Hooks {
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

export interface CanvasEnvironmentConfig {
    backgroundColor?: any;
    brightestColor?: any;
    darknessColor?: any;
    daylightColor?: any;
    environment?: any;
    fogExploredColor?: any;
    fogUnexploredColor?: any;
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
