import { NextResponse } from 'next/server';
import { findOrCreateUser } from '@/serverActions/userActions';
import { auth } from '../../../../auth';

export async function GET() {
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
