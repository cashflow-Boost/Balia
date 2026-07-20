// Exécution des actes sortants — UNIQUEMENT après validation humaine d'une
// carte (Tome 11). SMS réel via Twilio si configuré ; sinon envoi simulé.

import { config, hasTwilio } from "@/lib/config";
import { audit } from "@/lib/audit";
import type { Channel } from "@/types";

export interface OutboundResult {
  delivered: boolean;
  detail: string;
}

export async function sendOutbound(options: {
  cardId: string;
  channel: Channel;
  to: string;
  body: string;
}): Promise<OutboundResult> {
  const { cardId, channel, to, body } = options;

  if (channel === "sms" && hasTwilio()) {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${config.twilioAccountSid}:${config.twilioAuthToken}`,
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: config.twilioFromNumber,
          Body: body,
        }),
      },
    );
    if (!res.ok) {
      await audit("outbound.failed", cardId, `twilio ${res.status}`);
      return { delivered: false, detail: `Échec Twilio (HTTP ${res.status})` };
    }
    await audit("outbound.sent", cardId, "sms via twilio");
    return { delivered: true, detail: "SMS envoyé via Twilio" };
  }

  // Mode démo : aucun envoi réel, trace d'audit uniquement (sans PII).
  await audit("outbound.simulated", cardId, `canal ${channel}`);
  return {
    delivered: false,
    detail: `Envoi ${channel} simulé (connecteur non configuré)`,
  };
}
