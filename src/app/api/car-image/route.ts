import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const year = searchParams.get('year');

    if (!brand) {
      return NextResponse.json({ error: "Brand is required" }, { status: 400 });
    }

    // 1. Try Local Image
    const brandUpper = brand.toUpperCase().replace(/ /g, '_');
    const modelUpper = (model || '').toUpperCase();
    
    // Model variants to try: Exact, Hyphenated, First Word
    const modelVariants = [
        modelUpper, // "EGEA CROSS"
        modelUpper.replace(/ /g, '-'), // "EGEA-CROSS"
        modelUpper.replace(/ /g, ''), // "EGEACROSS"
        modelUpper.split(' ')[0], // "EGEA"
        modelUpper.split('-')[0] // For "E-DOBLO" -> "E" (maybe not good, lets stick to safe ones)
    ].filter(Boolean);

    // Remove duplicates
    const uniqueVariants = Array.from(new Set(modelVariants));

    const extensions = ['jpg', 'png', 'webp', 'jpeg', 'JPG', 'PNG', 'WEBP'];
    
    for (const variant of uniqueVariants) {
        for (const ext of extensions) {
            // Check public/aracresimleri/{BRAND}/{VARIANT}.{EXT}
            // Note: In Next.js, we check the real path. Since public/aracresimleri is a symlink,
            // checking process.cwd() + '/public/aracresimleri' should follow it or at least resolving it.
            // But since it's a symlink to /home/.../aracresimleri, allow fs to handle it.
            
            const relativePath = `aracresimleri/${brandUpper}/${variant}.${ext}`;
            const publicPath = path.join(process.cwd(), 'public', relativePath);
            
            if (fs.existsSync(publicPath)) {
                return NextResponse.json({ imageUrl: `/${relativePath}` });
            }
        }
    }

    // 2. Fallback to Serper (Google Images) if no local image found
    // Using key from existing scripts or env
    const serperKey = process.env.SERPER_API_KEY || "c54a2c0b18f493218783bd24abef63aceb9c1b18";
    const query = `${year || ''} ${brand} ${model} car`.trim();

    if (serperKey) {
        try {
            const serperRes = await fetch('https://google.serper.dev/images', {
                method: 'POST',
                headers: {
                    'X-API-KEY': serperKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: query,
                    num: 1,
                    gl: 'tr',
                    hl: 'tr'
                })
            });

            if (serperRes.ok) {
                const serperData = await serperRes.json();
                if (serperData.images && serperData.images.length > 0) {
                    return NextResponse.json({ imageUrl: serperData.images[0].imageUrl });
                }
            }
        } catch (error) {
            console.error("Serper Image Error:", error);
        }
    }

    // 3. Fallback to Pexels if Serper fails
    const pexelsKey = process.env.PEXELS_API_KEY;
    if (!pexelsKey) {
      return NextResponse.json({ imageUrl: null });
    }
    
    // Check Pexels
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: pexelsKey
        }
      }
    );

    if (!res.ok) {
      return NextResponse.json({ imageUrl: null });
    }

    const data = await res.json();
    
    if (data.photos && data.photos.length > 0) {
      return NextResponse.json({ 
        imageUrl: data.photos[0].src.large2x || data.photos[0].src.large 
      });
    }

    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    console.error("Car Image API Error:", error);
    return NextResponse.json({ imageUrl: null });
  }
}
