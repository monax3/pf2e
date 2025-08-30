import DocumentSheetV2 from "@client/applications/api/document-sheet.mjs";
import { ImageFilePath } from "@common/constants.mjs";
import { CardsSource } from "@common/documents/cards.mjs";
import { BaseCards } from "./_module.mjs";
import ClientDocumentMixin from "./abstract/client-document.mjs";
import Card from "./card.mjs";

export type CardDrawMode = (typeof CONST.CARD_DRAW_MODES)[keyof typeof CONST.CARD_DRAW_MODES];

export interface CardActionOptions {
    action?: 'pass' | 'draw' | 'play' | 'discard';
    chatNotification?: boolean;
    updateData?: Record<string, unknown>;
    how: CardDrawMode;
}

/**
 * The client-side Cards document which extends the common BaseCards model.
 * Each Cards document contains CardsData which defines its data schema.
 *
 * @see {@link CardStacks}  The world-level collection of Cards documents
 * @see {@link CardsConfig} The Cards configuration application
 */
export default class Cards extends ClientDocumentMixin(BaseCards) {
    /** Provide a thumbnail image path used to represent this document. */
    get thumbnail(): ImageFilePath;

    /** The Card documents within this stack which are available to be drawn. */
    get availableCards(): Card<this>[];

    /** The Card documents which belong to this stack but have already been drawn. */
    get drawnCards(): Card<this>[];

    /** Returns the localized Label for the type of Card Stack this is */
    get typeLabel(): string;

    /** Can this Cards document be cloned in a duplicate workflow? */
    get canClone(): boolean;

    deal(to: Cards[], number?: number, options?: CardActionOptions): Promise<Cards>

    draw(from: Cards, number?: number, options?: CardActionOptions): Promise<Card[]>;

    /**
     * Pass an array of specific Card documents from this document to some other Cards stack.
     * @param {Cards} to                Some other Cards document that is the destination for the pass operation
     * @param {object} [options={}]     Options which modify the pass operation
     * @param {object} [options.updateData={}]  Modifications to make to the Card as part of the pass operation,
     *                                  for example the displayed face
     * @returns {Promise<Card>}         A reference to this card after it has been passed to another parent document
     */
    pass(to: Cards, ids: string[], options?: Pick<CardActionOptions, 'action' | 'updateData' | 'chatNotification'>): Promise<Card<Cards>[]>;

    /**
     * Recall the Cards stack, retrieving all original cards from other stacks where they may have been drawn if this is a deck, otherwise returning all the cards in this stack to the decks where they originated.
     * @param {object} [options={}]   Options which modify the recall operation
     * @returns {Promise<Cards>}       A reference to the recalled card belonging to its original parent
     */
    recall(options?: Pick<CardActionOptions, 'chatNotification' | 'updateData'>): Promise<Cards>;

    shuffle(options?: Pick<CardActionOptions, 'chatNotification' | 'updateData'>): Promise<Cards>;

    dealDialog(): Promise<null | Cards>
    drawDialog(): Promise<null | Card[]>
    passDialog(): Promise<null | Cards>
    resetDialog(): Promise<null | false | Cards>;
    playDialog(card: Card): Promise<null | Card[]>

    protected sortStandard(a: Card, b: Card): number;
    protected sortShuffled(a: Card, b: Card): number;
}

export default interface Cards {
    readonly _source: CardsSource;
    readonly cards: foundry.abstract.EmbeddedCollection<Card<this>>;

    get sheet(): DocumentSheetV2;
}

export {};
