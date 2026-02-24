import { NextResponse } from 'next/server';
import { findOrCreateUser } from '@/serverActions/userActions';
import { getOptionalSession } from '@/lib/optionalSession';

export async function GET() {
  const session = await getOptionalSession();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ user: null }, { status: 200 });
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
