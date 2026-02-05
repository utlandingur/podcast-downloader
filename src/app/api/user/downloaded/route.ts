import { NextRequest, NextResponse } from 'next/server';
import { addDownloadedEpisode, findOrCreateUser } from '@/serverActions/userActions';
import { auth } from '../../../../../auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const podcastId = body?.podcastId;
  const episodeId = body?.episodeId;

  if (!podcastId || !episodeId) {
    return NextResponse.json(
      { error: 'Missing podcastId or episodeId' },
      { status: 400 },
    );
  }

  try {
    const user = await findOrCreateUser(email);
    const updated = await addDownloadedEpisode(user, podcastId, episodeId);
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Error updating downloaded episodes', error);
    return NextResponse.json(
      { error: 'Failed to update downloads' },
      { status: 500 },
    );
  }
}
