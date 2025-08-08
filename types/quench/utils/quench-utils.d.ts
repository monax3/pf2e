import type { QuenchBatchKey } from "../quench.js";
/**
 * Represents the state of a test or suite
 *
 * @enum
 * @internal
 */
export declare const RUNNABLE_STATES: {
    readonly IN_PROGRESS: "progress";
    readonly PENDING: "pending";
    readonly SUCCESS: "success";
    readonly FAILURE: "failure";
};
/** The current state of a runnable element */
export type RUNNABLE_STATE = (typeof RUNNABLE_STATES)[keyof typeof RUNNABLE_STATES];
/**
 * Gets the STATE of a Test instance
 *
 * @internal
 * @param test - the mocha Test instance to determine the state of
 * @returns the state of the test
 */
export declare function getTestState(test: Mocha.Test): RUNNABLE_STATE;
/**
 * Gets the STATE of a Suite instance, based on the STATE of its contained suites and tests
 *
 * @internal
 * @param suite - the mocha Suite instance to determine the state of
 * @returns the state of the suite
 */
export declare function getSuiteState(suite: Mocha.Suite): RUNNABLE_STATE;
/**
 * Get the batch key for a test, suite, or hook.
 *
 * @param test - The test, suite, or hook to get the batch key for
 * @returns The batch key, or "" if none was found.
 */
export declare function getBatchKey(runnable: Mocha.Runnable | Mocha.Test | Mocha.Suite | Mocha.Hook): string;
/**
 * Returns a tuple containing the package name and the batch identifier
 *
 *
 * @internal
 * @param batchKey - The batch key
 * @returns A tuple of package name and batch identifier
 */
export declare function getBatchNameParts(batchKey: QuenchBatchKey): [packageName: string, batchId: string];
/**
 * The module's prefix used for console logging
 * @internal
 */
export declare const logPrefix: "QUENCH | ";
/**
 * This module's `id` (formerly `name`) as per its manifest
 * @internal
 */
export declare const MODULE_ID: "quench";
/** Ensures {@link game} is initialized, either returning the {@link Game} instance or throwing an error. */
/**
 * Tests if the given `value` is truthy.
 *
 * If it is not truthy, an {@link Error} is thrown, which depends on the given `message` parameter:
 * - If `message` is a string`, it is used to construct a new {@link Error} which then is thrown.
 * - If `message` is an instance of {@link Error}, it is thrown.
 * - If `message` is `undefined`, an {@link Error} with a default message is thrown.
 */
export declare function enforce(value: unknown, message?: string | Error): asserts value;
/**
 * Localizes a string including variable formatting, using {@link Localization.format},
 * and prepending `QUENCH.` to the string's ID.
 *
 * @internal
 * @param key - The ID of the string to be translated
 * @param [data] - Additional data
 * @returns The localized string
 */
export declare function localize(key: string, data?: Record<string, unknown>): string;
/**
 * Returns a string after truncating it to a fixed length.
 *
 * @internal
 * @param string - The string to be truncated
 * @param length - New maximum length
 * @returns The truncated string
 */
export declare function truncate(string: string, length?: number): string;
interface CreateNodeOptions {
    /** Attributes set for the HTMLElement via {@link HTMLElement.setAttribute} */
    attr?: Record<string, string>;
    /**
     * A string of HTML directly set as the element's {@link HTMLElement.innerHTML}
     * before possible children are added
     */
    html?: string;
    children?: string | HTMLElement | (string | HTMLElement)[];
    baseNode?: HTMLElement | undefined;
}
/**
 * Creates an HTMLElement for a given `tag` and optionally sets attributes, innerHTML, children.
 *
 * @internal
 * @param tag - A valid HTML tag name, like "a" or "span"
 * @param options - Additional options affecting the element's contents
 * @returns The created HTML element
 */
export declare function createNode(tag: string, options?: CreateNodeOptions): HTMLElement;
export declare function toggleHidden(element: HTMLElement | null, state: boolean | undefined): boolean | null;
/**
 * A utility function acting as a type guard, ensuring an element is not null or undefined.
 *
 * @internal
 * @param value - Value that could be null or undefined
 */
export declare function nonNullable<T>(value: T): value is NonNullable<T>;
/**
 * A utility function that retrieves Quench's `filter` setting
 *
 * @internal
 * @see {@link ClientSettings.Values["quench.preselectFilters"]}
 * @return An array of trimmed strings containing batch key filters
 */
export declare function getFilterSetting(): string[];
/**
 * Additional options affecting how directories are created
 */
interface CreateDirectoryOptions {
    /**
     * Whether missing directories in the path should also be created
     *
     * @defaultValue `true`
     */
    recursive?: boolean;
}
/**
 * Ensures a directory exists and optionally walks the full path,
 * creating missing directories therein, to ensure a directory's existence.
 *
 * @param fullPath - The full path of the directory to be created
 * @param options - Additional options affecting how a directory is created
 * @returns Whether the directory exists now
 */
export declare function createDirectory(fullPath: string, options?: CreateDirectoryOptions): Promise<boolean>;
/**
 * Creates a directory tree mirroring a given object's tree.
 * Defined as function to enable recursive usage.
 *
 * @param obj - The object used as blueprint for the directory tree
 * @param previous - String accumulator for already created directories, needed to get a full path
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function createDirectoryTree(obj: object, previous?: string): Promise<any[]>;
/**
 * Serializes a given data object using the "pretty-format" package.
 *
 * @internal
 * @param data - Data to be serialized
 * @returns Serialized data
 */
export declare function serialize(data: unknown): string;
export {};
