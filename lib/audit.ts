// Journal d'audit — garde-fou RGPD (Tome 11) : ids et événements uniquement,
// jamais de PII (nom, email, téléphone, adresse) dans les entrées ni les logs.

import { getStore } from "@/lib/store";

export async function audit(
  event: string,
  refId: string,
  detail?: string,
): Promise<void> {
  await getStore().appendAudit({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    event,
    refId,
    detail,
  });
}
