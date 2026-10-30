import type { ComponentType } from "react";

export type IconType = ComponentType<{ className?: string }>;

export interface Condition {
  name: string;
  icon: IconType;
}

export interface EvidenceItem {
  id: number;
  quote: string;
  url: string;
  title: string;
}

export interface NeuralNode {
  id: number;
  cx: number;
  cy: number;
}

export interface SocialFeed {
  platform: string;
  handle: string;
  icon: IconType;
  link: string;
  image?: string;
  video?: string;
  caption: string;
  likes: string;
  comments: string;
  type: "image" | "video";
}

export interface ModalConfig {
  isOpen: boolean;
  title: string;
  description: string;
  icon: IconType | null;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface GrowthCard {
  icon: IconType;
  title: string;
  description: string;
  cta: string;
}

export interface GetInvolvedCard {
  icon: IconType;
  title: string;
  description: string;
  ctaText: string;
}

/** Shared modal opener signature used by all section components. */
export type OpenModalFn = (
  title: string,
  description: string,
  icon: IconType,
  ctaText?: string,
  ctaLink?: string,
  secondaryCtaText?: string,
  secondaryCtaLink?: string,
) => void;

export type MovementMobility = "seated" | "assistedStanding" | "independent";

export interface MovementItem {
  id: string;
  src: string;
  style: "generic" | "tango";
  mobility: MovementMobility;
  titleKey: string;
  descriptionKey: string;
  minutes: number;
}
