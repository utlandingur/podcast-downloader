import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateUser, toggleFavouritePodcast } from '@/serverActions/userActions';
import { getOptionalSession } from '@/lib/optionalSession';

export async function POST(req: NextRequest) {
  const session = await getOptionalSession();
  const email = session?.user?.email;

  const body = await req.json().catch(() => null);
  const podcastId = body?.podcastId;
  const favourited = body?.favourited;

  if (!podcastId || typeof favourited !== 'boolean') {
    return NextResponse.json(
      { error: 'Missing podcastId or favourited flag' },
      { status: 400 },
    );
  }

  if (!email) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const user = await findOrCreateUser(email);
    const updated = await toggleFavouritePodcast(user, podcastId, favourited);
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Error updating favourite', error);
    return NextResponse.json(
      { error: 'Failed to update favourite' },
      { status: 500 },
    );
  }
}
