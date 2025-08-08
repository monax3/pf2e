import type { Quench } from "../quench.js";
import { MissingSnapshotError } from "../utils/quench-snapshot-error.js";
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import ApplicationRenderContext = foundry.applications.ApplicationRenderContext;
// declare const QuenchResults_base: import("fvtt-types/utils").Mixin<typeof HandlebarsApplicationMixin.HandlebarsApplication, typeof ApplicationV2>;
/**
 * The visual UI for representing Quench test batches and the tests results thereof.
 *
 * @internal
 */
export declare class QuenchResults extends HandlebarsApplicationMixin(ApplicationV2) {
    /** The `Quench` instance this `Application` is used by */
    quench: Quench;
    /** Whether the button allowing snapshot updates should be shown after a run */
    private _enableSnapshotUpdates;
    /**
     * @param quench - The `Quench` instance this `Application` belongs to
     * @param options - Additional options
     */
    constructor(quench: Quench, options?: Partial<foundry.applications.types.ApplicationConfiguration>);
    static override DEFAULT_OPTIONS: {
        id: string;
        tag: string;
        position: {
            width: number;
            height: number;
            top: number;
            left: number;
        };
        window: {
            title: string;
            resizable: boolean;
            controls: {
                icon: string;
                label: string;
                action: string;
            }[];
        };
        actions: {
            select: typeof QuenchResults._onSelect;
            run: typeof QuenchResults._onRun;
            abort: typeof QuenchResults._onAbort;
            updateSnapshots: typeof QuenchResults._onUpdateSnapshots;
            expand: typeof QuenchResults._onExpander;
            openSettings: typeof QuenchResults._onOpenSettings;
        };
    };
    static PARTS: {
        main: {
            template: string;
            root: boolean;
        };
    };
    /** @inheritDoc */
    _prepareContext(_options: foundry.applications.types.ApplicationRenderOptions): Promise<QuenchResultData>;
    /** @inheritDoc */
    _onRender(context: QuenchResultData, options: foundry.applications.types.ApplicationRenderOptions): Promise<void>;
    /**
     * Handle clicking on the "Select All" or "Select None" buttons
     */
    static _onSelect(this: QuenchResults, _event: Event, target: HTMLElement): void;
    /**
     * Handle clicking on the "Run" button
     */
    static _onRun(this: QuenchResults, _event: Event, _target: HTMLElement): Promise<void>;
    /**
     * Handle clicking on the "Abort" button
     */
    static _onAbort(this: QuenchResults, _event: Event, _target: HTMLElement): void;
    /**
     * Handle clicking on the "Update Snapshots" button
     */
    static _onUpdateSnapshots(this: QuenchResults, _event: Event, _target: HTMLElement): Promise<void>;
    /**
     * Handle clicking on the settings button, opening the settings configuration with the Quench tab activated.
     */
    static _onOpenSettings(this: QuenchResults, _event: Event, _target: HTMLElement): Promise<void>;
    /**
     * Handle clicking on an expander, either to expand or collapse a summary or list of tests.
     *
     * @remarks For some reason, this convoluted handling including pauses/timeouts, listeners etc. is necessary
     * to allow Firefox to properly transition the height of the expandable element without getting stuck,
     * while at the same time allowing Chromium to transition without resorting to flickering.
     * @internal
     * @param event - The click event
     */
    static _onExpander(this: QuenchResults, event: Event, target: HTMLElement): Promise<void>;
    /**
     * Filter displayed test batches.
     */
    private _onSearchFilter;
    /**
     * Clears the currently visible test results while maintaining currently selected test batches
     */
    clear(): Promise<void>;
    /**
     * Determines which test batch elements are checked in the UI
     * @returns An array of {@link QuenchBatchKey}s belonging to batches checked in the UI
     */
    private _getCheckedBatches;
    /**
     * Finds or creates an unordered list to contain items for each child runnable (test or suite) of the given parent
     * @param parentListElement - The <li> of the parent test batch or suite
     * @returns The <ul> into which child runnables can be inserted.
     */
    private _findOrMakeChildList;
    /**
     * Creates a new <li> to represent the runnable given by the provided details
     * @param title - The runnable title to show in the UI.
     * @param id - The mocha id of the runnable.
     * @param isTest - Whether this runnable is a test (or a suite, if false)
     * @returns The <li> element representing this runnable.
     */
    private _makeRunnableLineItem;
    /**
     * Updates the given existing <li> representing a runnable based on the given state
     * @param listElement - The list element representing the runnable
     * @param state - the state of the runnable
     * @param isTest - whether the item is a test
     */
    private _updateLineItemStatus;
    private static _getErrorDiff;
    private _setElementDisabled;
    /**
     * Called by {@link QuenchReporter} when a mocha suite begins running
     * @param suite - The starting Mocha suite
     */
    handleSuiteBegin(suite: Mocha.Suite): void;
    /**
     * Called by {@link QuenchReporter} when a mocha suite finishes running
     * @param suite - The finished Mocha suite
     */
    handleSuiteEnd(suite: Mocha.Suite): void;
    /**
     * Called by {@link QuenchReporter} when a mocha test begins running
     * @param test - The starting test
     */
    handleTestBegin(test: Mocha.Test): void;
    /**
     * Called by {@link QuenchReporter} when a mocha test finishes running
     *
     * @param test - The finished test
     */
    handleTestEnd(test: Mocha.Test): void;
    /**
     * Called by {@link QuenchReporter} when a mocha test finishes running and fails
     * @param test - The failed test
     * @param error - The error thrown by the test
     */
    handleTestFail(test: Mocha.Test | Mocha.Hook, error: Chai.AssertionError | MissingSnapshotError): void;
    /**
     * Called by {@link QuenchReporter} when a before hook for a whole batch fails,
     * so that in lieu of failed tests or suites the whole batch can be marked as failed.
     *
     * @param hook - The failed hook
     * @param error - The error thrown by the hook
     */
    handleBatchFail(hook: Mocha.Hook, error: Error): void;
    /**
     * Called by {@link QuenchReporter} when mocha begins a test run
     */
    handleRunBegin(): void;
    /**
     * Called by {@link QuenchReporter} when mocha completes a test run
     * @param stats - Run statistics
     */
    handleRunEnd(stats: Mocha.Stats): void;
}
interface QuenchResultData extends ApplicationRenderContext {
    anyBatches: boolean;
    batches: {
        name: string;
        displayName: string;
        selected: boolean;
    }[];
}
export {};
