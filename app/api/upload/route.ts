import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename with timestamp and random ID
  const timestamp = Date.now();
  const randomId = crypto.randomUUID().split('-')[0];
  const uniqueName = `${timestamp}-${randomId}-${file.name}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  // Return the URL
  const url = `/uploads/${uniqueName}`;

  return NextResponse.json({ success: true, url });
}