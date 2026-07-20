// Types métier Balia — socle MVP (leads, annonces, cartes de résultat, audit).

export type Channel = "email" | "sms" | "whatsapp" | "phone";

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  channel: Channel;
  /** Coordonnée de contact (email ou téléphone) — PII : jamais dans les logs. */
  contact: string;
  message: string;
  source: string;
  projectType?: "achat" | "vente" | "location" | "estimation" | "autre";
}

export interface LeadQualification {
  /** 0–100 : probabilité que le lead soit sérieux et actionnable. */
  score: number;
  segment: "chaud" | "tiede" | "froid";
  summary: string;
  proposedReply: string;
  proposedSlots: string[];
}

export interface PropertyInput {
  kind: string;
  city: string;
  surfaceM2: number;
  rooms: number;
  price?: number;
  highlights: string;
}

export interface Announcement {
  title: string;
  body: string;
  /** Canaux de multidiffusion préparés (publication soumise à validation). */
  portals: string[];
}

/**
 * La carte de résultat — unité de base de l'interface (Bible, Tome 7).
 * Tout ce que Balia produit revient sous cette forme ; tout acte sortant
 * exige une validation humaine (Tome 11).
 */
export type CardKind = "lead_reply" | "announcement";
export type CardStatus = "draft" | "validated" | "rejected";

export interface ResultCard {
  id: string;
  createdAt: string;
  updatedAt: string;
  kind: CardKind;
  status: CardStatus;
  title: string;
  /** Contenu produit par l'agent, éditable avant validation. */
  payload: LeadReplyPayload | AnnouncementPayload;
  /** Id de l'objet source (lead, bien). */
  sourceId: string;
  /** Trace de l'exécution sortante après validation (jamais avant). */
  outcome?: string;
}

export interface LeadReplyPayload {
  kind: "lead_reply";
  qualification: LeadQualification;
  channel: Channel;
}

export interface AnnouncementPayload {
  kind: "announcement";
  announcement: Announcement;
  property: PropertyInput;
}

/** Journal d'audit — ids uniquement, jamais de PII (Tome 11). */
export interface AuditEntry {
  id: string;
  at: string;
  event: string;
  refId: string;
  detail?: string;
}
