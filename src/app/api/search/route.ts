import { NextRequest, NextResponse } from 'next/server';
import { lookupPodcastsV1, lookupPodcastsV2 } from '@/serverActions/lookupPodcasts';
import { getE2EMockSearchResults } from '@/lib/testMocks';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term') || searchParams.get('q');
  const limitParam = searchParams.get('limit');
  const source = (searchParams.get('source') || 'v2').toLowerCase();

  if (process.env.E2E_MOCKS === '1') {
    if (!term) return NextResponse.json([], { status: 200 });
    return NextResponse.json(getE2EMockSearchResults(term));
  }

  if (!term) {
    return NextResponse.json(
      { error: 'Missing search term' },
      { status: 400 },
    );
  }

  const limit = limitParam ? Number.parseInt(limitParam, 10) : 6;

  try {
    if (source === 'v1') {
      const results = await lookupPodcastsV1(
        term,
        Number.isFinite(limit) ? limit : 6,
      );
      return NextResponse.json(results);
    }

    const results = await lookupPodcastsV2(
      term,
      Number.isFinite(limit) ? limit : 6,
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching podcasts', error);
    return NextResponse.json(
      { error: 'Failed to search podcasts' },
      { status: 500 },
    );
  }
}
