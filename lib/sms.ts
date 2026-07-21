// Envoi de SMS via Twilio (BIBLE Tome 8.5 : confirmation immédiate post-RDV).
// Appel direct de l'API REST Twilio — pas de SDK, pour garder le bundle léger.

export interface SmsResult {
  ok: boolean;
  sid?: string;
  skipped?: boolean; // true si Twilio n'est pas configuré (dev/preview)
  error?: string;
}

/**
 * Envoie un SMS. Si Twilio n'est pas configuré, ne fait rien (skipped) au lieu
 * de planter — pour que la prise de RDV fonctionne quand même en preview.
 */
export async function envoyerSms(to: string, body: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from) {
    return { ok: false, skipped: true };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams({ To: to, From: from, Body: body });
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Twilio ${res.status}: ${detail}` };
    }

    const data = (await res.json()) as { sid?: string };
    return { ok: true, sid: data.sid };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

const fmtRdv = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

/**
 * Message de confirmation de RDV (récap : intervention, date/heure, adresse).
 */
export function messageConfirmationRdv(params: {
  nomEntreprise: string;
  prenomClient?: string | null;
  intervention?: string | null;
  dateDebut: string;
  adresse?: string | null;
}): string {
  const salut = params.prenomClient ? `Bonjour ${params.prenomClient}, ` : "";
  const quoi = params.intervention ? `${params.intervention} ` : "intervention ";
  const quand = fmtRdv.format(new Date(params.dateDebut));
  const ou = params.adresse ? `, ${params.adresse}` : "";
  return (
    `${salut}votre rendez-vous avec ${params.nomEntreprise} est confirmé : ` +
    `${quoi}le ${quand}${ou}. À bientôt !`
  );
}
