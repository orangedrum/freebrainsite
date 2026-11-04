import type { MovementItem, MovementMobility } from "@/types";

const MOVEMENT_VIDEO_BY_MOBILITY: Record<MovementMobility, string> = {
  seated: "/handexercise3.mp4",
  assistedStanding: "/handexercise3.mp4",
  independent: "/ex_standing.mp4",
};

export const MOVEMENTS: MovementItem[] = [
  { id: "seated-generic", src: MOVEMENT_VIDEO_BY_MOBILITY.seated, style: "generic", mobility: "seated", titleKey: "movement.seatedGeneric.title", descriptionKey: "movement.seatedGeneric.description", whyHelpfulKey: "movement.seatedGeneric.whyHelpful", minutes: 5 },
  { id: "seated-tango", src: MOVEMENT_VIDEO_BY_MOBILITY.seated, style: "tango", mobility: "seated", titleKey: "movement.seatedTango.title", descriptionKey: "movement.seatedTango.description", whyHelpfulKey: "movement.seatedTango.whyHelpful", minutes: 15 },
  { id: "assisted-generic", src: MOVEMENT_VIDEO_BY_MOBILITY.assistedStanding, style: "generic", mobility: "assistedStanding", titleKey: "movement.assistedGeneric.title", descriptionKey: "movement.assistedGeneric.description", whyHelpfulKey: "movement.assistedGeneric.whyHelpful", minutes: 5 },
  { id: "assisted-tango", src: MOVEMENT_VIDEO_BY_MOBILITY.assistedStanding, style: "tango", mobility: "assistedStanding", titleKey: "movement.assistedTango.title", descriptionKey: "movement.assistedTango.description", whyHelpfulKey: "movement.assistedTango.whyHelpful", minutes: 15 },
  { id: "independent-generic", src: MOVEMENT_VIDEO_BY_MOBILITY.independent, style: "generic", mobility: "independent", titleKey: "movement.independentGeneric.title", descriptionKey: "movement.independentGeneric.description", whyHelpfulKey: "movement.independentGeneric.whyHelpful", minutes: 5 },
  { id: "independent-tango", src: MOVEMENT_VIDEO_BY_MOBILITY.independent, style: "tango", mobility: "independent", titleKey: "movement.independentTango.title", descriptionKey: "movement.independentTango.description", whyHelpfulKey: "movement.independentTango.whyHelpful", minutes: 15 },
];

export const MOBILITY_OPTIONS: { value: MovementMobility; key: string }[] = [
  { value: "seated", key: "movementPlanner.mobility.seated" },
  { value: "assistedStanding", key: "movementPlanner.mobility.assistedStanding" },
  { value: "independent", key: "movementPlanner.mobility.independent" },
];

export const FOCUS_OPTIONS: { value: string; key: string }[] = [
  { value: "freezingGait", key: "movementPlanner.focus.freezingGait" },
  { value: "tremor", key: "movementPlanner.focus.tremor" },
  { value: "posturalInstability", key: "movementPlanner.focus.posturalInstability" },
];

export const CONDITIONS = [
  "alzheimers",
  "essentialTremor",
  "cognitiveImpairments",
  "als",
  "cerebrovascularDisease",
  "huntingtonsDisease",
  "multipleSclerosis",
  "epilepsy",
  "spinaBifida",
  "dystonias",
  "dementia",
  "cerebralPalsy",
  "diabeticNeuropathy",
  "migraines",
  "parkinsonsDisease",
];

export const TIME_OPTIONS = [1, 5, 15];

export const FAQ_ITEMS = [
  { id: "q1", questionKey: "movements.faq.q1", answerKey: "movements.faq.a1" },
  { id: "q2", questionKey: "movements.faq.q2", answerKey: "movements.faq.a2" },
  { id: "q3", questionKey: "movements.faq.q3", answerKey: "movements.faq.a3" },
  { id: "q4", questionKey: "movements.faq.q4", answerKey: "movements.faq.a4" },
  { id: "q5", questionKey: "movements.faq.q5", answerKey: "movements.faq.a5" },
  { id: "q6", questionKey: "movements.faq.q6", answerKey: "movements.faq.a6" },
  { id: "q7", questionKey: "movements.faq.q7", answerKey: "movements.faq.a7" },
  { id: "q8", questionKey: "movements.faq.q8", answerKey: "movements.faq.a8" },
  { id: "q9", questionKey: "movements.faq.q9", answerKey: "movements.faq.a9" },
  { id: "q10", questionKey: "movements.faq.q10", answerKey: "movements.faq.a10" },
];
