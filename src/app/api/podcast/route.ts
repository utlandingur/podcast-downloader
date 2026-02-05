import { NextRequest, NextResponse } from 'next/server';
import { lookupPodcastV2 } from '@/serverActions/lookupPodcast';
import { ensureAuthorizedRequest } from '@/lib/deviceAuth';
import { getE2EMockPodcast } from '@/lib/testMocks';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing podcast id' }, { status: 400 });
  }

  if (process.env.E2E_MOCKS === '1') {
    const mock = getE2EMockPodcast(id);
    if (!mock) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 });
    }
    return NextResponse.json(mock);
  }

  const bodyText = await req.clone().text();
  const auth = await ensureAuthorizedRequest(req, bodyText);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
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
