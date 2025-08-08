/**
 * Pauses execution for the given number of milliseconds
 *
 * @param millis - duration to pause for in milliseconds
 * @returns A `Promise` that is resolved when the given time passed
 */
export declare function pause(millis: number): Promise<void>;
/**
 * Resets the world to a blank state with no entities.
 *
 * **WARNING: This will permanently delete every entity in your world (scenes, actors, items, macros, roll tables, journal entries, playlists, chat messages, folders, etc.)**
 */
export declare function clearWorld(): Promise<void>;
