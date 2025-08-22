import type { DocumentFlags } from "@common/data/_module.d.mts";
import type { ModelPropsFromSchema } from "@common/data/fields.d.mts";
import type { TokenSchema } from "@common/documents/token.d.mts";

interface TokenFlagDataPF2e {
    pf2e: {
        [key: string]: unknown;
        linkToActorSize: boolean;
        autoscale: boolean;
    };
}
type TokenFlagsPF2e = TokenFlagDataPF2e & DocumentFlags;

type DetectionModeEntry = ModelPropsFromSchema<TokenSchema>["detectionModes"][number];

export type { DetectionModeEntry, TokenFlagDataPF2e, TokenFlagsPF2e };
