// Génère un brouillon d'annonce et le place dans la file de validation.
// Rien n'est publié ici — la publication attend le geste humain.

import { NextResponse } from 'next/server';
import { generateAnnonce, type PropertyInput } from '../../../agents/annonces/generate';
import { addApproval } from '../../../lib/store';

const KINDS = ['appartement', 'maison', 'terrain', 'local'] as const;

export async function POST(request: Request) {
  let input: PropertyInput;
  try {
    input = (await request.json()) as PropertyInput;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  // Validation d'entrée explicite (garde-fou §5 : assainir toute entrée externe).
  if (
    !KINDS.includes(input.kind) ||
    typeof input.city !== 'string' || input.city.trim() === '' || input.city.length > 120 ||
    !Number.isFinite(input.surfaceM2) || input.surfaceM2 <= 0 ||
    !Number.isFinite(input.rooms) || input.rooms <= 0 ||
    !Number.isFinite(input.price) || input.price <= 0 ||
    typeof input.highlights !== 'string' || input.highlights.length > 1000
  ) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const draft = await generateAnnonce(input);
  const approval = addApproval({
    kind: 'annonce',
    title: `Annonce — ${draft.title}`,
    proposedBody: draft.body,
    context:
      draft.generatedBy === 'claude'
        ? 'Rédigée par Balia à partir de votre description. À valider avant multidiffusion.'
        : 'Brouillon de démonstration (clé API Claude absente). À valider avant multidiffusion.',
  });
  console.log(`[audit] annonce_draft:${approval.id} created (${draft.generatedBy})`);
  return NextResponse.json({ approvalId: approval.id }, { status: 201 });
}
