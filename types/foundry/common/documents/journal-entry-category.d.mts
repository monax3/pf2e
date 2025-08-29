import { DocumentOwnershipLevel } from "@common/constants.mjs";
import { Document, DocumentMetadata } from "../abstract/_module.mjs";
import * as fields from "../data/fields.mjs";
import { BaseJournalEntry, BaseUser } from "./_module.mjs";

/** The JournalEntryPage document model. */
export default class BaseJournalEntryCategory<TParent extends BaseJournalEntry | null> extends Document<
    TParent,
    JournalEntryCategorySchema
> {
    static override get metadata(): JournalEntryCategoryMetadata;

    static override defineSchema(): JournalEntryCategorySchema;

    override getUserLevel(user: BaseUser): DocumentOwnershipLevel;
}

export default interface BaseJournalEntryCategory<TParent extends BaseJournalEntry | null>
    extends Document<TParent, JournalEntryCategorySchema>,
        fields.ModelPropsFromSchema<JournalEntryCategorySchema> {
    get documentName(): JournalEntryCategoryMetadata["name"];
}

interface JournalEntryCategoryMetadata extends DocumentMetadata {
    name: "JournalEntryCategory";
    collection: "categories";
    indexed: true;
    label: "DOCUMENT.JournalEntryCategory";
    labelPlural: "DOCUMENT.JournalEntryCategories";
}

type JournalEntryCategorySchema<
    TType extends string = string,
    TSystemSource extends object = object,
    TSystemData extends object = TSystemSource,
> = {
    _id: fields.DocumentIdField;
    /** The text name of this page. */
    name: fields.StringField<string, string, true, false, false>;
    /** The numeric sort value which orders this page relative to its siblings. */
    sort: fields.IntegerSortField;
    /** An object of optional key/value flags. */
    flags: fields.DocumentFlagsField;
    /** An object of creation and access information */
    _stats: fields.DocumentStatsField;
};

export type JournalEntryCategorySource = fields.SourceFromSchema<JournalEntryCategorySchema>;
export type JournalEntryCategoryData = fields.ModelPropsFromSchemaWithOptional<JournalEntryCategorySchema>
