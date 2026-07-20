import { NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { getProjectIfKeyValid } from '../../../../lib/automation-auth';

// Reads CLOUDINARY_URL from the environment automatically.
cloudinary.config({ secure: true });

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 });
    }

    const apiKey = req.headers.get('x-api-key');
    const project = await getProjectIfKeyValid(Number(projectId), apiKey);

    if (!project) {
      return NextResponse.json({ error: 'Invalid API key for this project' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // type: 'authenticated' means the asset can't be fetched without a valid signature —
    // not a publicly guessable URL like the previous Catbox-hosted links.
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          type: 'authenticated',
          folder: `qa-console/${projectId}`,
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
          resolve(result);
        },
      );
      Readable.from(buffer).pipe(uploadStream);
    });

    const videoUrl = cloudinary.url(uploadResult.public_id, {
      resource_type: 'video',
      type: 'authenticated',
      format: uploadResult.format,
      sign_url: true,
      secure: true,
    });

    return NextResponse.json({ videoUrl });
  } catch (error: any) {
    console.error("Upload Route Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}