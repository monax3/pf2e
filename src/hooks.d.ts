import type { ActorPF2e } from "@actor";
import type { ResourceData } from "@actor/creature/index.ts";
import type { Rolled } from "@client/dice/_module.mjs";
import type { CombatantPF2e } from "@module/encounter/combatant.ts";
import type { EncounterPF2e } from "@module/encounter/document.ts";
import type { CheckRoll } from "@system/check/roll.ts";
import type { DamageRoll } from "@system/damage/roll.ts";
import type { WorldClockSettings } from "@system/settings/world-clock.ts";

declare global {
    namespace Hooks {
        interface SystemApplications {
            WorldClockSettings: WorldClockSettings;
        }

        interface AllHooks {
            "pf2e.startTurn": (combatant: Maybe<CombatantPF2e>, encounter: EncounterPF2e, userId: string) => Return;
            "pf2e.endTurn": (combatant: Maybe<CombatantPF2e>, encounter: EncounterPF2e, userId: string) => Return;
            "pf2e.preReroll": (
                oldRoll: Rolled<CheckRoll>,
                newRoll: CheckRoll,
                resource: Maybe<ResourceData>,
                keep?: "new" | "lower" | "higher",
            ) => Return;
            "pf2e.reroll": (
                oldRoll: Rolled<CheckRoll>,
                newRoll: Rolled<CheckRoll>,
                resource: Maybe<ResourceData>,
                keep?: "new" | "lower" | "higher",
            ) => Return;
            "pf2e.damageRoll": (roll: Rolled<DamageRoll>) => Return;
            "pf2e.systemReady": () => Return;
            "pf2e.restForTheNight": (actor: ActorPF2e) => Return;
            migrationComplete: () => Return;
            "babele.ready": () => Return;
        }
    }
}
