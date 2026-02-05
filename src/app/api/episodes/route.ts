import { lookupPodcastEpisodes, lookupPodcastEpisodesV2 } from '@/serverActions/lookupPodcastEpisodes';
import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthorizedRequest } from '@/lib/deviceAuth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const podcastId = searchParams.get('id');
  const source = (searchParams.get('source') || 'v2').toLowerCase();

  const bodyText = await req.clone().text();
  const auth = await ensureAuthorizedRequest(req, bodyText);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Validate the podcastId parameter
  if (!podcastId) {
    return NextResponse.json(
      { error: 'Missing podcastId parameter' },
      { status: 400 },
    );
  }

  try {
    const episodes =
      source === 'v1'
        ? await lookupPodcastEpisodes(podcastId)
        : await lookupPodcastEpisodesV2(podcastId);
    return NextResponse.json(episodes, {
      headers: { 'Cache-Control': 'public, s-maxage=3000, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('Error fetching episodes', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 },
    );
  }
}
