import { lookupPodcastEpisodesV2 } from '@/serverActions/lookupPodcastEpisodes';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const podcastId = searchParams.get('id');

  // Validate the podcastId parameter
  if (!podcastId) {
    return NextResponse.json(
      { error: 'Missing podcastId parameter' },
      { status: 400 },
    );
  }

  try {
    const episodes = await lookupPodcastEpisodesV2(podcastId);
    return NextResponse.json(episodes);
  } catch (error) {
    console.error('Error fetching episodes', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 },
    );
  }
}
