import type { ActorPF2e, ActorSheetPF2e } from "./types/pf2e/exports/actor.d.ts";
import type { ChatMessagePF2e } from "./types/pf2e/exports/chat-message.d.ts";
import type { EncounterPF2e, CombatantPF2e } from "./types/pf2e/exports/encounter.d.ts";
import type { ItemPF2e, ItemSheetPF2e } from "./types/pf2e/exports/item.d.ts";
import type { TokenDocumentPF2e, TileDocumentPF2e } from "./types/pf2e/exports/scene.d.ts";
import type { ActiveEffectPF2e } from "./types/pf2e/exports/active-effect.d.ts";
import type {
    RegionDocumentPF2e,
    AmbientLightDocumentPF2e,
    MeasuredTemplateDocumentPF2e,
} from "./types/pf2e/exports/scene.d.ts";

declare module '@client/helpers/hooks.mjs' {
    interface SystemDocumentClasses {
        ActiveEffect: typeof ActiveEffectPF2e<ActorPF2e | ItemPF2e | null>;
        Actor: typeof ActorPF2e;
        ChatMessage: typeof ChatMessagePF2e;
        Token: typeof TokenDocumentPF2e;
        Combat: typeof EncounterPF2e;
        MeasuredTemplate: typeof MeasuredTemplateDocumentPF2e;
        Item: typeof ItemPF2e;
        Combatant: typeof CombatantPF2e;
        Tile: typeof TileDocumentPF2e;
        AmbientLight: typeof AmbientLightDocumentPF2e;
        Region: typeof RegionDocumentPF2e;
    }

    interface SystemApplicationsV1 {
        ActorSheet: ActorSheetPF2e<ActorPF2e>;
        ItemSheet: ItemSheetPF2e<ItemPF2e>;
    }
}
