import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ secure: true });

const RETENTION_DAYS = 30;
const MAX_PAGES = 20; // safety cap per run; remaining old videos get caught on the next day's run

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  let deleted = 0;
  let nextCursor: string | undefined;

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const result = await cloudinary.api.resources({
        type: 'authenticated',
        resource_type: 'video',
        prefix: 'qa-console/',
        max_results: 100,
        next_cursor: nextCursor,
      });

      const staleIds: string[] = result.resources
        .filter((r: any) => new Date(r.created_at) < cutoff)
        .map((r: any) => r.public_id);

      if (staleIds.length > 0) {
        await cloudinary.api.delete_resources(staleIds, { resource_type: 'video', type: 'authenticated' });
        deleted += staleIds.length;
      }

      nextCursor = result.next_cursor;
      if (!nextCursor) break;
    }

    return NextResponse.json({ success: true, deleted, cutoff: cutoff.toISOString() });
  } catch (error: any) {
    console.error('Video cleanup cron error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
