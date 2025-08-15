import { FormFooterButton } from '../../_types.mjs';
import { default as ApplicationV2 } from '../../api/application.mjs';
import { default as Actor } from '../../../documents/actor.mjs';
import { default as TokenDocument } from '../../../documents/token.mjs';
import { DataSchema } from '../../../../common/abstract/_types.mjs';
import { PrototypeToken } from '../../../../common/data/_module.mjs';
import { HandlebarsApplicationMixin_base } from '../../api/handlebars-application.mjs';
export declare abstract class TokenApplicationMixin_base {
    /**
     * Localized Token Display Modes
     */
    static get DISPLAY_MODES(): Record<string, string>;
    /**
     * Localized Token Dispositions
     */
    static get TOKEN_DISPOSITIONS(): Record<string, string>;
    /**
     * Localized Token Turn Marker modes
     */
    static get TURN_MARKER_MODES(): Record<string, string>;
    /**
     * Localized Token Shapes
     */
    static get TOKEN_SHAPES(): Record<string, string>;
    /**
     * Maintain a copy of the original to show a real-time preview of changes.
     */
    protected _preview: TokenDocument | PrototypeToken<Actor> | null;
    /**
     * Is the token a PrototypeToken?
     */
    abstract isPrototype: boolean;
    /**
     * A reference to the Actor the token depicts
     */
    abstract get actor(): Actor | null;
    /**
     * The TokenDocument or PrototypeToken
     */
    abstract get token(): TokenDocument | PrototypeToken<Actor>;
    /**
     * The schema fields for this token DataModel
     */
    protected abstract get _fields(): DataSchema;
    /**
     * Assign a preview clone for propagating form changes across the sheet and (if editing a TokenDocument) the
     * canvas.
     */
    protected abstract _initializeTokenPreview(): Promise<void>;
    /**
     * Mimic changes to the Token document as if they were true document updates.
     * @param The changes to preview.
     */
    protected _previewChanges(changes: Record<string, unknown>): void;
    /**
     * Prepare data to be displayed in the Identity tab.
     */
    protected _prepareIdentityTab(): object;
    /**
     * Prepare data to be displayed in the Appearance tab.
     */
    protected _prepareAppearanceTab(): Promise<object>;
    /**
     * Prepare data to be displayed in the Vision tab.
     */
    protected _prepareVisionTab(): Promise<object>;
    /**
     * Prepare data to be displayed in the Vision tab.
     */
    protected _prepareLightTab(): Promise<object>;
    /**
     * Prepare data to be displayed in the Resources tab.
     */
    protected _prepareResourcesTab(): Promise<object>;
    /**
     * Prepare form submission buttons.
     */
    protected _prepareButtons(): FormFooterButton[];
    /**
     * Process several fields from form submission data into proper model changes.
     * @param submitData Form submission data passed through {@link foundry.applications.ux.FormDataExtended}
     */
    protected _processChanges(submitData: Record<string, unknown>): void;
}
/**
 * A mixin for UI shared between TokenDocument and PrototypeToken sheets
 */
export default function TokenApplicationMixin<TBase extends AbstractConstructorOf<ApplicationV2>>(Base: TBase): AbstractMixin<TBase, TokenApplicationMixin_base & HandlebarsApplicationMixin_base, typeof TokenApplicationMixin_base & typeof HandlebarsApplicationMixin_base & typeof ApplicationV2>;
