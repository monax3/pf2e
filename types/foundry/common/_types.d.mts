export * from "@common/documents/_types.mjs";
import ApplicationV2 from "../client/applications/api/application.mjs";
import Application from "../client/appv1/api/application-v1.mjs";
import { DataModelConstructionContext } from "./abstract/_types.mjs";
import DataModel from "./abstract/data.mjs";
import Document from "./abstract/document.mjs";
import { DataField } from "./data/fields.mjs";
import Color from "./utils/color.mjs";

/* ----------------------------------------- */
/*  Data Model                               */
/* ----------------------------------------- */
// FIXME
export interface DocumentConstructionContext<TParent extends Document | null>
    extends DataModelConstructionContext<TParent> {
    /** The compendium collection ID which contains this Document, if any */
    pack?: string | null;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | symbol | null | undefined;

/* ----------------------------------------- */
/*  Reusable Type Definitions                */
/* ----------------------------------------- */

/**
 * Make all properties in T recursively readonly.
 */
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends undefined | null | boolean | number | string | symbol | bigint | Function
    ? T[K]
    : T[K] extends Array<infer V>
    ? ReadonlyArray<DeepReadonly<V>>
    : T[K] extends Map<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T[K] extends Set<infer V>
    ? ReadonlySet<DeepReadonly<V>>
    : DeepReadonly<T[K]>;
};

/**
 * A 2D point, expressed as an array [x, y].
 */
interface Point {
    /** The x-coordinate in pixels */
    x: number;
    /** The y-coordinate of the top-left corner */
    y: number;
}

/**
 * A single point, expressed as an array [x,y]
 */
type PointArray = [x: number, y: number];

/**
 * A 3D point, expessed as {x, y, elevation}.
 */
interface ElevatedPoint extends Point {
    /** The elevation in grid units */
    elevation: number;
}

/**
 * A standard rectangle interface.
 */
interface Rectangle {
    /** The x-coordinate of the top-left corner */
    x: number;
    /** The y-coordinate of the top-left corner */
    y: number;
    /** The width */
    width: number;
    /** The height */
    height: number;
}

type BuiltinType = NumberConstructor | StringConstructor | BooleanConstructor;

type ColorSource = number | [red: number, green: number, blue: number] | string | Color;

/* ----------------------------------------- */
/*  Settings Type Definitions                */
/* ----------------------------------------- */

/** A Client Setting */
interface SettingConfig<
    TChoices extends Record<string, unknown> | undefined = Record<string, unknown> | undefined,
> {
    /** A unique machine-readable id for the setting */
    key: string;
    /** The namespace the setting belongs to */
    namespace: string;
    /** The human readable name */
    name: string;
    /** An additional human readable hint */
    hint?: string;
    /** The scope the Setting is stored in, either World or Client */
    scope: "world" | "client";
    /** Indicates if this Setting should render in the Config application */
    config: boolean;
    /** This will prompt the user to reload the application for the setting to take effect. */
    requiresReload?: boolean;
    /** The JS Type that the Setting is storing */
    type:
    | NumberConstructor
    | StringConstructor
    | BooleanConstructor
    | ObjectConstructor
    | ArrayConstructor
    | ConstructorOf<DataModel>
    | DataField;
    /** For string Types, defines the allowable values */
    choices?: TChoices;
    /** For numeric Types, defines the allowable range */
    range?: this["type"] extends NumberConstructor ? { min: number; max: number; step: number; } : never;
    /** The default value */
    default?: number | string | boolean | object | (() => number | string | boolean | object);
    /** Executes when the value of this Setting changes */
    onChange?: (choice: TChoices extends object ? keyof TChoices : unknown) => void | Promise<void>;
}

interface SettingSubmenuConfig {
    /** The human readable name */
    name: string;
    /** The human readable label */
    label: string;
    /** An additional human readable hint */
    hint: string;
    /** The classname of an Icon to render */
    icon: string;
    /** The FormApplication to render */
    type: ConstructorOf<Application> | ConstructorOf<ApplicationV2>;
    /** If true, only a GM can edit this Setting */
    restricted: boolean;
}

/** A Client Keybinding Action Configuration */
interface KeybindingActionConfig {
    /** The namespace within which the action was registered */
    namespace?: string;
    /** The human readable name */
    name: string;
    /** An additional human readable hint */
    hint?: string;
    /** The default bindings that can never be changed nor removed. */
    uneditable?: KeybindingActionBinding[];
    /** The default bindings that can be changed by the user. */
    editable?: KeybindingActionBinding[];
    /** A function to execute when a key down event occurs. If True is returned, the event is consumed and no further keybinds execute. */
    onDown?: (context: KeyboardEventContext) => unknown;
    /** A function to execute when a key up event occurs. If True is returned, the event is consumed and no further keybinds execute. */
    onUp?: (context: KeyboardEventContext) => unknown;
    /** If True, allows Repeat events to execute the Action's onDown. Defaults to false. */
    repeat?: boolean;
    /** If true, only a GM can edit and execute this Action */
    restricted?: boolean;
    /** Modifiers such as [ "CONTROL" ] that can be also pressed when executing this Action. Prevents using one of these modifiers as a Binding. */
    reservedModifiers?: ModifierKey[];
    /** The preferred precedence of running this Keybinding Action */
    precedence?: number;
    /** The recorded registration order of the action */
    order?: number;
}

interface KeybindingActionBinding {
    /** A numeric index which tracks this bindings position during form rendering */
    index?: number;
    /** The KeyboardEvent#code value from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values */
    key: string | null;
    /** An array of modifiers keys from KeyboardManager.MODIFIER_KEYS which are required for this binding to be activated */
    modifiers: ModifierKey[];
}

/** An action that can occur when a key is pressed */
interface KeybindingAction {
    /** The namespaced machine identifier of the Action */
    action: string;
    /** The Keyboard key */
    key: string;
    /** The human readable name */
    name: string;
    /** Required modifiers */
    requiredModifiers?: ModifierKey[];
    /** Optional (reserved) modifiers */
    optionalModifiers?: ModifierKey[];
    /** The handler that executes onDown */
    onDown?: (...args: unknown[]) => boolean;
    /** The handler that executes onUp */
    onUp?: (...args: unknown[]) => boolean;
    /** If True, allows Repeat events to execute this Action's onDown */
    repeat?: boolean;
    /** If true, only a GM can execute this Action */
    restricted?: boolean;
    /** The registration precedence */
    precedence?: number;
    /** The registration order */
    order?: number;
}

/**
 * Keyboard event context
 */
interface KeyboardEventContext {
    /** The normalized string key, such as "A" */
    key: string;
    /** The originating keypress event */
    event: KeyboardEvent;
    /** Is the Shift modifier being pressed */
    isShift: boolean;
    /** Is the Control or Meta modifier being processed */
    isControl: boolean;
    /** Is the Alt modifier being pressed */
    isAlt: boolean;
    /** Are any of the modifiers being pressed */
    hasModifiers: boolean;
    /** A list of string modifiers applied to this context, such as [ "CONTROL" ] */
    modifiers: ModifierKey[];
    /** True if the Key is Up, else False if down */
    up: boolean;
    /** True if the given key is being held down such that it is automatically repeating. */
    repeat: boolean;
    /** The executing Keybinding Action. May be undefined until the action is known. */
    action?: string;
}

/**
 * Connected Gamepad info
 */
interface ConnectedGamepad {
    /** A map of axes values */
    axes: Map<string, number>;
    /** The Set of pressed Buttons */
    activeButtons: Set<string>;
}

/* ----------------------------------------- */
/*  Socket Requests and Responses            */
/* ----------------------------------------- */

type RequestData = object | object[] | string | string[];

interface SocketRequest {
    /** The type of object being modified */
    type?: string;
    /** The server-side action being requested */
    action?: string;
    /** Data applied to the operation */
    data?: RequestData;
    query?: object;
    /** The type of parent document */
    parentType?: string;
    /** The ID of a parent document */
    parentId?: string;
    /** A Compendium pack name */
    pack?: string | null;
    /** Additional options applied to the request */
    options?: object;
}

interface SocketResponse {
    /** The initial request */
    request: SocketRequest;
    /** An error, if one occurred */
    error?: Error;
    /** The status of the request */
    status?: string;
    /** The ID of the requesting User */
    userId?: string;
    /** Data returned as a result of the request */
    result: Record<string, unknown>[];
}

type ModifierKey = "Control" | "Shift" | "Alt";

export {
    Builtin,
    BuiltinType,
    ColorSource,
    ConnectedGamepad,
    ConstructorOf as Constructor,
    DeepPartial,
    DeepReadonly,
    ElevatedPoint,
    KeybindingAction,
    KeybindingActionBinding,
    KeybindingActionConfig,
    KeyboardEventContext,
    Point,
    PointArray,
    Rectangle,
    RequestData,
    SettingConfig,
    SettingSubmenuConfig,
    SocketRequest,
    SocketResponse
};
