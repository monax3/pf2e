/**
 * The general Quench API, including the global {@link Quench quench} hub.
 *
 * Interfaces and types exported by this module are safe to be used in TypeScript definitions.
 * Types not exported from this module, but from files deeper in the module tree, are not considered
 * part of the public API and might be changed without warning in future versions.
 *
 * @module quench
 */
/// <reference types="mocha" />
/// <reference types="chai" />
/// <reference types="chai-as-promised" />
import "./quench-init.js";
export type { Quench, QuenchBatchContext, QuenchRegisterBatchOptions, QuenchRegisterBatchFunction, QuenchRunBatchOptions, QuenchJsonReportOptions, QuenchReports, QuenchBatchData, QuenchBatchKey, } from "./quench.js";
export type { QuenchSnapshotManager } from "./quench-snapshot.js";
export type { MissingSnapshotError } from "./utils/quench-snapshot-error.js";
export type { QuenchReporter, QuenchJsonReport, QuenchCleanedTestData } from "./quench-reporter.js";
export type { QuenchResults } from "./apps/quench-results.js";
