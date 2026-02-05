import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateUser } from '@/serverActions/userActions';
import { auth } from '../../../../auth';
import { ensureAuthorizedRequest } from '@/lib/deviceAuth';

export async function GET(req: NextRequest) {
  const bodyText = await req.clone().text();
  const authCheck = await ensureAuthorizedRequest(req, bodyText);
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await findOrCreateUser(email);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  }
}
