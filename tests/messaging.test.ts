import { describe, expect, it } from 'vitest';
import {
  sendMessage,
  templateHash,
  type OutboundMessage,
  type RecipientContext,
  type Transport,
} from '../lib/messaging';

const FIRST_CONTACT = 'Bonjour, merci pour votre demande. Quel est votre projet ?';
const templates = new Map([['first_contact', templateHash(FIRST_CONTACT)]]);

const recipient = (over: Partial<RecipientContext> = {}): RecipientContext => ({
  optedOut: false,
  localHour: 14,
  ...over,
});

function fakeTransport(): { transport: Transport; delivered: string[] } {
  const delivered: string[] = [];
  return {
    delivered,
    transport: {
      async deliver(body: string) {
        delivered.push(body);
        return { providerRef: 'SM123' };
      },
    },
  };
}

const msg = (over: Partial<OutboundMessage> = {}): OutboundMessage => ({
  body: FIRST_CONTACT,
  sentBy: 'balia_scenario',
  templateKey: 'first_contact',
  isFollowup: false,
  ...over,
});

describe('sendMessage — garde-fou human-in-the-loop', () => {
  it('envoie un message du scénario dont le template correspond', async () => {
    const { transport, delivered } = fakeTransport();
    const out = await sendMessage(msg(), recipient(), templates, transport);
    expect(out).toEqual({ sent: true, providerRef: 'SM123' });
    expect(delivered).toHaveLength(1);
  });

  it('refuse un message "scénario" dont le contenu dévie du template approuvé', async () => {
    const { transport, delivered } = fakeTransport();
    const out = await sendMessage(
      msg({ body: 'Texte halluciné qui ne vient pas du template' }),
      recipient(),
      templates,
      transport,
    );
    expect(out).toEqual({ sent: false, refusedBecause: 'template_hash_mismatch' });
    expect(delivered).toHaveLength(0);
  });

  it('refuse un brouillon non approuvé', async () => {
    const { transport } = fakeTransport();
    const out = await sendMessage(
      msg({ sentBy: 'balia_draft', templateKey: undefined, approvalStatus: 'pending' }),
      recipient(),
      templates,
      transport,
    );
    expect(out).toEqual({ sent: false, refusedBecause: 'draft_not_approved' });
  });

  it('refuse un brouillon rejeté', async () => {
    const { transport } = fakeTransport();
    const out = await sendMessage(
      msg({ sentBy: 'balia_draft', templateKey: undefined, approvalStatus: 'rejected' }),
      recipient(),
      templates,
      transport,
    );
    expect(out.sent).toBe(false);
  });

  it('envoie un brouillon approuvé par un humain', async () => {
    const { transport } = fakeTransport();
    const out = await sendMessage(
      msg({
        sentBy: 'balia_draft',
        body: 'Réponse libre validée par le collaborateur',
        templateKey: undefined,
        approvalStatus: 'approved',
      }),
      recipient(),
      templates,
      transport,
    );
    expect(out.sent).toBe(true);
  });

  it('refuse tout envoi après opt-out, même approuvé', async () => {
    const { transport, delivered } = fakeTransport();
    const out = await sendMessage(
      msg({ sentBy: 'human' }),
      recipient({ optedOut: true }),
      templates,
      transport,
    );
    expect(out).toEqual({ sent: false, refusedBecause: 'opted_out' });
    expect(delivered).toHaveLength(0);
  });

  it('refuse les relances entre 21h et 8h', async () => {
    const { transport } = fakeTransport();
    for (const hour of [21, 23, 0, 7]) {
      const out = await sendMessage(
        msg({ isFollowup: true }),
        recipient({ localHour: hour }),
        templates,
        transport,
      );
      expect(out).toEqual({ sent: false, refusedBecause: 'quiet_hours' });
    }
  });

  it('autorise une relance à 8h et un message non-relance la nuit', async () => {
    const { transport } = fakeTransport();
    const followupAt8 = await sendMessage(
      msg({ isFollowup: true }),
      recipient({ localHour: 8 }),
      templates,
      transport,
    );
    expect(followupAt8.sent).toBe(true);
    // Une réponse immédiate à un prospect qui écrit à 23h n'est pas une relance.
    const replyAtNight = await sendMessage(msg(), recipient({ localHour: 23 }), templates, transport);
    expect(replyAtNight.sent).toBe(true);
  });

  it('refuse un template inconnu du scénario approuvé', async () => {
    const { transport } = fakeTransport();
    const out = await sendMessage(
      msg({ templateKey: 'unknown_key' }),
      recipient(),
      templates,
      transport,
    );
    expect(out).toEqual({ sent: false, refusedBecause: 'unknown_template' });
  });
});
