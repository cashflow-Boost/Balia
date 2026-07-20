// Couche données : Supabase si configuré, sinon store en mémoire (démo/dev).
// Le store en mémoire vit le temps du process — suffisant pour la première
// victoire visible de l'onboarding (Tome 12), pas pour la production.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config, hasSupabase } from "@/lib/config";
import type { AuditEntry, Lead, ResultCard } from "@/types";

export interface Store {
  createLead(lead: Lead): Promise<void>;
  getLead(id: string): Promise<Lead | null>;
  createCard(card: ResultCard): Promise<void>;
  getCard(id: string): Promise<ResultCard | null>;
  listCards(): Promise<ResultCard[]>;
  updateCard(card: ResultCard): Promise<void>;
  appendAudit(entry: AuditEntry): Promise<void>;
  listAudit(): Promise<AuditEntry[]>;
}

class MemoryStore implements Store {
  private leads = new Map<string, Lead>();
  private cards = new Map<string, ResultCard>();
  private audit: AuditEntry[] = [];

  async createLead(lead: Lead): Promise<void> {
    this.leads.set(lead.id, lead);
  }
  async getLead(id: string): Promise<Lead | null> {
    return this.leads.get(id) ?? null;
  }
  async createCard(card: ResultCard): Promise<void> {
    this.cards.set(card.id, card);
  }
  async getCard(id: string): Promise<ResultCard | null> {
    return this.cards.get(id) ?? null;
  }
  async listCards(): Promise<ResultCard[]> {
    return [...this.cards.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
  async updateCard(card: ResultCard): Promise<void> {
    this.cards.set(card.id, card);
  }
  async appendAudit(entry: AuditEntry): Promise<void> {
    this.audit.push(entry);
  }
  async listAudit(): Promise<AuditEntry[]> {
    return [...this.audit].reverse();
  }
}

class SupabaseStore implements Store {
  private db: SupabaseClient;

  constructor() {
    this.db = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
  }

  async createLead(lead: Lead): Promise<void> {
    const { error } = await this.db.from("leads").insert({
      id: lead.id,
      created_at: lead.createdAt,
      data: lead,
    });
    if (error) throw new Error(`Supabase leads.insert: ${error.message}`);
  }
  async getLead(id: string): Promise<Lead | null> {
    const { data, error } = await this.db
      .from("leads")
      .select("data")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Supabase leads.select: ${error.message}`);
    return (data?.data as Lead) ?? null;
  }
  async createCard(card: ResultCard): Promise<void> {
    const { error } = await this.db.from("result_cards").insert({
      id: card.id,
      created_at: card.createdAt,
      status: card.status,
      data: card,
    });
    if (error) throw new Error(`Supabase result_cards.insert: ${error.message}`);
  }
  async getCard(id: string): Promise<ResultCard | null> {
    const { data, error } = await this.db
      .from("result_cards")
      .select("data")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Supabase result_cards.select: ${error.message}`);
    return (data?.data as ResultCard) ?? null;
  }
  async listCards(): Promise<ResultCard[]> {
    const { data, error } = await this.db
      .from("result_cards")
      .select("data")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase result_cards.list: ${error.message}`);
    return (data ?? []).map((row) => row.data as ResultCard);
  }
  async updateCard(card: ResultCard): Promise<void> {
    const { error } = await this.db
      .from("result_cards")
      .update({ status: card.status, data: card })
      .eq("id", card.id);
    if (error) throw new Error(`Supabase result_cards.update: ${error.message}`);
  }
  async appendAudit(entry: AuditEntry): Promise<void> {
    const { error } = await this.db.from("audit_log").insert({
      id: entry.id,
      at: entry.at,
      event: entry.event,
      ref_id: entry.refId,
      detail: entry.detail ?? null,
    });
    if (error) throw new Error(`Supabase audit_log.insert: ${error.message}`);
  }
  async listAudit(): Promise<AuditEntry[]> {
    const { data, error } = await this.db
      .from("audit_log")
      .select("id, at, event, ref_id, detail")
      .order("at", { ascending: false });
    if (error) throw new Error(`Supabase audit_log.list: ${error.message}`);
    return (data ?? []).map((row) => ({
      id: row.id as string,
      at: row.at as string,
      event: row.event as string,
      refId: row.ref_id as string,
      detail: (row.detail as string | null) ?? undefined,
    }));
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __baliaStore: Store | undefined;
}

export function getStore(): Store {
  if (!globalThis.__baliaStore) {
    globalThis.__baliaStore = hasSupabase()
      ? new SupabaseStore()
      : new MemoryStore();
  }
  return globalThis.__baliaStore;
}
