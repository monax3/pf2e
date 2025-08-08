import type { Quench, QuenchBatchKey } from "./quench.js";
declare global {
    namespace Chai {
        interface AssertStatic {
            /**
             * Asserts equality of serialised argument (actual) and previously stored snapshot (expected)
             *
             * @param obj - The actual value to be compared to the snapshot
             */
            matchSnapshot: (obj: unknown) => void;
        }
        interface Assertion {
            /** Asserts equality of a test's serialised value (actual) and previously stored snapshot (expected) */
            matchSnapshot: () => void;
        }
        interface AssertionError {
            snapshotError?: boolean;
        }
    }
}
/**
 * The `QuenchSnapshotManager` class is a helper class, meant to be instantiated alongside a `Quench` class.
 * It provides various methods enabling the fetching, caching, managing, and updating of snapshots.
 *
 * @beta
 * @internal
 */
export declare class QuenchSnapshotManager {
    /**
     * Creates an instance of a `QuenchSnapshotManager`
     *
     * @param quench - The `Quench` instance whose snapshots will be managed
     */
    constructor(quench: Quench);
    quench: Quench;
    /**
     * This instance's file cache, containing all serialised snapshots, ordered first by batch name, then by hashed full test titles
     */
    private fileCache;
    /** A cache array containing batchKeys whose data has to be updated */
    private updateQueue;
    /** A boolean that determines whether snapshots should be updated after the next run. */
    enableUpdates: boolean | undefined;
    /**
     * Generates a string for a batch's default directory in which snapshots will be stored.
     *
     * @param batchKey - The batchKey from which a path will be generated
     * @returns The default directory path
     */
    static getDefaultSnapDir(batchKey: QuenchBatchKey): string;
    /**
     * Enables snapshot usage by adding `matchSnapshot` assertion to chai
     *
     * @param chai - The global chai object
     * @param utils - Chai utils
     */
    static enableSnapshots(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void;
    /**
     * Creates a 13 character hash from a string using fnv1a
     *
     * @param string - The string to be hashed
     * @returns The string's hash
     */
    static hash(string: string): string;
    /** Resets the current fileCache */
    private resetCache;
    /**
     * Returns a batch's snapshot directory, combining its configured snapBaseDir with its batchKey
     *
     * @param batchKey - The batch whose directory is requested
     * @returns The batch's snapshot directory
     */
    getSnapDir(batchKey: string): string;
    /**
     * Returns a batch's snapshot from the cache.
     *
     * @param batchKey - A batch key belonging to a quench test batch
     * @param fullTitle - The name of a specific snapshot data object belonging to a test
     * @throws {@link SnapshotError} Throws an error if the requested snapshot cannot be found
     * @returns A snapshot string
     */
    readSnap(batchKey: string, fullTitle: string): string;
    /**
     * Loads all snaps for a Quench run
     *
     * @param batchKeys - The array of batch keys to be run
     * @returns A Promise that is resolved when all snapshot files are loaded
     */
    loadBatchSnaps(batchKeys: string[]): Promise<Record<string, Record<string, string>>>;
    /**
     * Stores a specific test's updated snapshot data in the cache and adds the batch to the list
     * of batches whose data has to be uploaded to the server.
     *
     * @param batchKey - The batch's key
     * @param fullTitle - The test's full title
     * @param newData - The new snapshot data
     */
    queueSnapUpdate(batchKey: string, fullTitle: string, newData: string): void;
    /**
     * Updates all snapshots whose data was changed in the last run (i.e. all batches listed in {@link QuenchSnapshotManager#updateQueue})
     */
    updateSnapshots(): Promise<{
        batch: string;
        file: string;
        status: string | number;
    }[]>;
}
