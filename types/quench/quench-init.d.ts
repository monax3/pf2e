import { Quench } from "./quench.js";
declare global {
    /**
     * The singleton instance of the {@link Quench} class, containing the primary public API.
     * Initialized in the Quench module's {@link Hooks.StaticCallbacks.init "init"} hook.
     */
    var quench: Quench | undefined;
    interface BrowserMocha {
        _cleanReferencesAfterRun: boolean;
    }
}
declare module '@client/helpers/hooks.mjs' {
    interface AllHooks {
        /**
         * A hook event that fires when Quench is ready to register batches.
            *
            * @group Initialization
            * @see {@link quench!Quench#registerBatch quench.registerBatch}
            * @remarks This is called by {@link Hooks.callAll}
            * @param quench - The global {@link Quench} instance
            */
        quenchReady: (quench: Quench) => void | Promise<void>;
    }
}
