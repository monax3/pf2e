/**
 * An error thrown when a test's snapshot cannot be read from the cache,
 * presumably because loading the file failed.
 *
 * @internal
 */
export declare class MissingSnapshotError extends Error {
    constructor(context: {
        batchKey: string;
        hash: string;
    });
}
