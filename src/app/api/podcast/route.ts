import { NextRequest, NextResponse } from 'next/server';
import { lookupPodcastV2 } from '@/serverActions/lookupPodcast';
import { ensureAuthorizedRequest } from '@/lib/deviceAuth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const bodyText = await req.clone().text();
  const auth = await ensureAuthorizedRequest(req, bodyText);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing podcast id' }, { status: 400 });
  }

  try {
    const podcast = await lookupPodcastV2(id);
    return NextResponse.json(podcast);
  } catch (error) {
    console.error('Error fetching podcast', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcast' },
      { status: 500 },
    );
  }
}
