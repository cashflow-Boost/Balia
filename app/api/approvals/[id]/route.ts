// Décision sur une carte de résultat. Verrou côté store : la première
// décision gagne, un double-tap renvoie 409.

import { NextResponse } from 'next/server';
import { decideApproval } from '../../../../lib/store';

interface DecisionBody {
  decision: 'approved' | 'edited' | 'rejected';
  editedBody?: string;
  rejectReason?: string;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  let body: DecisionBody;
  try {
    body = (await request.json()) as DecisionBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (!['approved', 'edited', 'rejected'].includes(body.decision)) {
    return NextResponse.json({ error: 'invalid_decision' }, { status: 400 });
  }
  if (body.decision === 'rejected' && !body.rejectReason?.trim()) {
    return NextResponse.json({ error: 'reject_reason_required' }, { status: 400 });
  }

  const item = decideApproval(id, body.decision, {
    editedBody: body.editedBody,
    rejectReason: body.rejectReason,
  });
  if (!item) {
    return NextResponse.json({ error: 'not_found_or_already_decided' }, { status: 409 });
  }
  // Audit log sans PII : identifiants techniques uniquement (garde-fou §5).
  console.log(`[audit] approval:${item.id} -> ${item.status}`);
  return NextResponse.json({ id: item.id, status: item.status });
}
